@file:Suppress("ktlint:standard:property-naming")

val kord_version: String by project
val kotlin_logging_version: String by project
val kotlin_result_version: String by project
val kotlin_version: String by project
val logback_version: String by project
val mongo_driver_version: String by project

plugins {
    kotlin("jvm") version "2.0.21"
    id("io.ktor.plugin") version "3.0.1"
    id("org.jetbrains.kotlin.plugin.serialization") version "2.0.21"
    id("org.jlleitschuh.gradle.ktlint") version "12.1.1"
}

group = "xyz.lebkuchenfm"

version = "0.0.1"

application {
    mainClass.set("xyz.lebkuchenfm.ApplicationKt")

    val isDevelopment: Boolean = project.ext.has("development")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=$isDevelopment")
}

repositories { mavenCentral() }

dependencies {
    implementation("io.ktor:ktor-client-core")
    implementation("io.ktor:ktor-client-okhttp")
    implementation("io.ktor:ktor-client-auth")
    implementation("io.ktor:ktor-client-content-negotiation")

    implementation("io.ktor:ktor-server-core-jvm")
    implementation("io.ktor:ktor-server-resources-jvm")
    implementation("io.ktor:ktor-server-host-common-jvm")
    implementation("io.ktor:ktor-server-netty-jvm")
    implementation("io.ktor:ktor-server-config-yaml")
    implementation("io.ktor:ktor-server-content-negotiation")
    implementation("io.ktor:ktor-server-sessions")
    implementation("io.ktor:ktor-server-websockets")
    implementation("io.ktor:ktor-server-auth")
    implementation("io.ktor:ktor-serialization-kotlinx-json")

    implementation("ch.qos.logback:logback-classic:$logback_version")
    implementation("io.github.oshai:kotlin-logging-jvm:$kotlin_logging_version")

    implementation("com.michael-bull.kotlin-result:kotlin-result:$kotlin_result_version")

    implementation("org.mongodb:mongodb-driver-kotlin-coroutine:$mongo_driver_version")
    implementation("org.mongodb:bson-kotlinx:$mongo_driver_version")

    implementation("dev.kord:kord-core:$kord_version")

    testImplementation("io.ktor:ktor-server-test-host-jvm")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")
}
