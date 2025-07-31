########################################################################################################################
#
# Define Global Build Arguments
#
########################################################################################################################
ARG NGINX_TAG="1.27.3"
ARG SOURCE_DATE_EPOCH="0"

########################################################################################################################
#
# Setup Production Container Image
#
########################################################################################################################
FROM nginx:${NGINX_TAG} AS production-interim

ARG SOURCE_DATE_EPOCH

COPY /dist/ /app
COPY nginx-docker.conf /etc/nginx/nginx.conf

########################################
####    Deterministic Build Hack    ####
########################################

# === Workarounds below will not be needed when https://github.com/moby/buildkit/pull/4057 is merged ===
# NOTE: PR #4057 has been merged but will not be available until the v0.13.x series of releases.
# Limit the timestamp upper bound to SOURCE_DATE_EPOCH.
# Workaround for https://github.com/moby/buildkit/issues/3180
#RUN find $( ls / | grep -E -v "^(dev|mnt|proc|sys)$" ) \
#  -newermt "@${SOURCE_DATE_EPOCH}" -writable -xdev \
#  | xargs touch --date="@${SOURCE_DATE_EPOCH}" --no-dereference

########################################################################################################################
#
# Final Image
#
########################################################################################################################
FROM scratch AS production-final
COPY --from=production-interim / /

ENV NGINX_VERSION=1.27.3
ENV NJS_VERSION=0.8.7
ENV NJS_RELEASE=1~bookworm
ENV PKG_RELEASE=1~bookworm
ENV DYNPKG_RELEASE=1~bookworm

LABEL maintainer="NGINX Docker Maintainers <docker-maint@nginx.com>"

EXPOSE 8080

STOPSIGNAL SIGQUIT
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
