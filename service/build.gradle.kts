plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.ktor)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.ktlint)
}

group = "xyz.lebkuchenfm"

version = providers.gradleProperty("lebkuchenfm_version").get()

application {
    mainClass.set("xyz.lebkuchenfm.ApplicationKt")

    val isDevelopment: Boolean = project.ext.has("development")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=$isDevelopment")
}

repositories { mavenCentral() }

dependencies {
    implementation(libs.ktor.client.core)
    implementation(libs.ktor.client.okhttp)
    implementation(libs.ktor.client.auth)
    implementation(libs.ktor.client.contentNegotiation)

    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.resources)
    implementation(libs.ktor.server.host.common)
    implementation(libs.ktor.server.netty)
    implementation(libs.ktor.server.config.yaml)
    implementation(libs.ktor.server.contentNegotiation)
    implementation(libs.ktor.server.sessions)
    implementation(libs.ktor.server.websockets)
    implementation(libs.ktor.server.auth)
    implementation(libs.ktor.serialization.json)

    implementation(libs.logback)
    implementation(libs.kotlin.logging)

    implementation(libs.result)
    implementation(libs.result.coroutines)

    implementation(libs.mongodb.driver.coroutine)
    implementation(libs.mongodb.serialization.bson)

    implementation(libs.kord.core)

    testImplementation(libs.ktor.server.test.host)
    testImplementation(libs.kotlin.test.junit)
}
