#!/usr/bin/env bash
#
# Publish build/client to an S3 bucket behind CloudFront and invalidate the paths that changed.
#
#   scripts/deploy-aws.sh                 build, then sync and invalidate
#   scripts/deploy-aws.sh --dry-run       show what would be uploaded, write nothing
#   scripts/deploy-aws.sh --skip-build    publish an existing build/client (what CI does)
#
# Configuration (environment variables, nothing hardcoded per project):
#   AWS_REGION          region of the SSM parameters (default us-west-2)
#   DEPLOY_SSM_PREFIX   SSM path holding `bucket_name` and `distribution_id`
#                       (published by the infrastructure repo), e.g. /base/prod/web/my-site
#   or, without SSM:
#   DEPLOY_BUCKET, DEPLOY_DISTRIBUTION_ID
#
# Hosting contract this script relies on (see docs/deploy.md): CloudFront rewrites clean URLs to
# `<path>/index.html` and serves /404/index.html with status 404 for missing objects.
#
# Runs on Linux runners and on Windows Git Bash.

set -euo pipefail

REGION="${AWS_REGION:-us-west-2}"
DIST="build/client"

# Git Bash rewrites arguments that look like POSIX paths ("/index.html") into Windows paths.
export MSYS_NO_PATHCONV=1

dry_run=false
skip_build=false
for arg in "$@"; do
  case "$arg" in
    --dry-run) dry_run=true ;;
    --skip-build) skip_build=true ;;
    -h|--help) sed -n '2,19p' "$0"; exit 0 ;;
    *) echo "unknown argument: $arg" >&2; exit 2 ;;
  esac
done

if ! $skip_build; then
  echo "== build"
  npm run build
fi

if [ ! -f "$DIST/index.html" ]; then
  echo "error: $DIST/index.html not found; build first or drop --skip-build" >&2
  exit 1
fi

echo "== resolve identifiers"
if [ -n "${DEPLOY_SSM_PREFIX:-}" ]; then
  read_param() {
    aws ssm get-parameter --region "$REGION" --name "$DEPLOY_SSM_PREFIX/$1" --query Parameter.Value --output text
  }
  bucket="$(read_param bucket_name)"
  distribution="$(read_param distribution_id)"
else
  bucket="${DEPLOY_BUCKET:?set DEPLOY_SSM_PREFIX or DEPLOY_BUCKET}"
  distribution="${DEPLOY_DISTRIBUTION_ID:?set DEPLOY_SSM_PREFIX or DEPLOY_DISTRIBUTION_ID}"
fi
echo "bucket:       $bucket"
echo "distribution: $distribution"

dry=()
if $dry_run; then
  dry=(--dryrun)
  echo "== DRY RUN: nothing will be written"
fi

# Cache contract. Everything under assets/ is content-hashed: cache forever. Everything else keeps
# its name between deploys: browsers revalidate HTML and route data on every load.
CACHE_ASSETS="public,max-age=31536000,immutable"
CACHE_STATIC="public,max-age=86400"
CACHE_DOCUMENT="no-cache"

# 1. Hashed assets first. No --delete yet: the HTML that is live right now still references the
#    previous hashes, and they must survive until it is replaced.
echo "== 1/4 hashed assets"
aws s3 sync "$DIST/assets/" "s3://$bucket/assets/" "${dry[@]}" --cache-control "$CACHE_ASSETS"

# 2. Static files that keep their name (icons, images, manifest, robots, sitemap).
echo "== 2/4 static files"
aws s3 sync "$DIST/" "s3://$bucket/" "${dry[@]}" \
  --exclude "assets/*" --exclude "*.html" --exclude "*.data" \
  --cache-control "$CACHE_STATIC"

# 3. Documents last (HTML pages and the .data files client navigation fetches), so no visitor
#    gets a page that references files not uploaded yet.
echo "== 3/4 documents"
aws s3 sync "$DIST/" "s3://$bucket/" "${dry[@]}" \
  --exclude "*" --include "*.html" \
  --content-type "text/html; charset=utf-8" --cache-control "$CACHE_DOCUMENT"
aws s3 sync "$DIST/" "s3://$bucket/" "${dry[@]}" \
  --exclude "*" --include "*.data" \
  --content-type "text/x-script" --cache-control "$CACHE_DOCUMENT"

# 4. Prune objects the new build no longer has (old hashes, removed pages). Everything above is
#    already uploaded, so this pass only deletes.
echo "== 4/4 prune"
aws s3 sync "$DIST/" "s3://$bucket/" "${dry[@]}" --delete --size-only

if $dry_run; then
  echo "== DRY RUN: invalidation skipped"
  exit 0
fi

# Invalidate only paths whose names do not change between deploys, never "/*" (it would evict
# the immutable assets from every edge). Large sites fall back to "/*" to stay under the limit.
echo "== invalidate"
mapfile -t paths < <(
  cd "$DIST"
  find . -type f ! -path "./assets/*" | sed 's#^\.##' | while read -r file; do
    case "$file" in
      /index.html) echo "/" ;;
      */index.html) echo "${file%/index.html}" ;;
    esac
    echo "$file"
  done | sort -u
)
if [ "${#paths[@]}" -gt 500 ]; then paths=("/*"); fi
aws cloudfront create-invalidation --distribution-id "$distribution" --paths "${paths[@]}" \
  --query 'Invalidation.{Id:Id,Status:Status}' --output text

echo "== done"
