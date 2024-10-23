val kotlin_version: String by project
val logback_version: String by project
val mongo_driver_version: String by project

plugins {
    kotlin("jvm") version "2.0.21"
    id("io.ktor.plugin") version "3.0.0"
    id("org.jetbrains.kotlin.plugin.serialization") version "2.0.21"
    id("com.ncorti.ktfmt.gradle").version("0.20.1")
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
    implementation("io.ktor:ktor-server-core-jvm")
    implementation("io.ktor:ktor-server-resources-jvm")
    implementation("io.ktor:ktor-server-host-common-jvm")
    implementation("io.ktor:ktor-server-netty-jvm")
    implementation("io.ktor:ktor-server-config-yaml")
    implementation("io.ktor:ktor-server-content-negotiation")
    implementation("io.ktor:ktor-serialization-kotlinx-json")

    implementation("ch.qos.logback:logback-classic:$logback_version")

    implementation("org.mongodb:mongodb-driver-kotlin-coroutine:$mongo_driver_version")

    testImplementation("io.ktor:ktor-server-test-host-jvm")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")
}

ktfmt {
    kotlinLangStyle()
    maxWidth.set(120)
    blockIndent.set(4)
    continuationIndent.set(4)
    removeUnusedImports.set(true)
    manageTrailingCommas.set(true)
}
