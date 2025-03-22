package xyz.lebkuchenfm.external.platform

import java.util.concurrent.TimeUnit

class Shell {
    fun exec(command: String): List<String> {
        ProcessBuilder("/bin/bash", "-c", command).run {
            val process = start()
            process.waitFor(5, TimeUnit.SECONDS)
            return process.inputStream.reader().readLines().filter { it.isNotBlank() }
        }
    }
}
