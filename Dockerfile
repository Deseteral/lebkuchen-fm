ARG NODE_VERSION=18
ARG JDK_VERSION=21

################################################################################
# Stage 1: Build client application
FROM node:${NODE_VERSION}-alpine AS client
WORKDIR /usr/src/app

COPY ./client ./client

WORKDIR ./client
RUN yarn install
RUN yarn run build

################################################################################
# Stage 2: Cache Gradle dependencies
FROM gradle:latest AS cache
RUN mkdir -p /home/gradle/cache_home
ENV GRADLE_USER_HOME=/home/gradle/cache_home
COPY ./service/build.gradle.* ./service/gradle.properties /home/gradle/app/
WORKDIR /home/gradle/app
RUN gradle clean build -i --stacktrace

################################################################################
# Stage 3: Build Application
FROM gradle:latest AS build
COPY --from=cache /home/gradle/cache_home /home/gradle/.gradle
COPY ./service /usr/src/app
WORKDIR /usr/src/app
COPY --chown=gradle:gradle ./service /home/gradle/src
WORKDIR /home/gradle/src
# Copy the static files from the build of frontend app to be hosted by the backend service.
COPY --from=client /usr/src/app/client/dist/ ./src/main/resources/static
# Build the fat JAR, Gradle also supports shadow
# and boot JAR by default.
RUN gradle buildFatJar --no-daemon

################################################################################
# Stage 4: Create the Runtime Image
FROM eclipse-temurin:${JDK_VERSION} AS runtime
EXPOSE 8080:8080
RUN mkdir /app
COPY --from=build /home/gradle/src/build/libs/*.jar /app/lebkuchenfm.jar
ENTRYPOINT ["java","-jar","/app/lebkuchenfm.jar"]
