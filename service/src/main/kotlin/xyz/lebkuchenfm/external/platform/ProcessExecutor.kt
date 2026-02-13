package xyz.lebkuchenfm.external.platform

import java.util.concurrent.TimeUnit

data class ProcessResult(
    val stdout: List<String>,
    val stderr: List<String>,
    val exitCode: Int,
)

class ProcessExecutor {
    // TODO: This method should not be blocking.
    fun exec(command: String): ProcessResult {
        ProcessBuilder("/bin/bash", "-c", command).run {
            val process = start()
            process.waitFor(5, TimeUnit.SECONDS)
            val stdout = process.inputStream.reader().readLines().filter { it.isNotBlank() }
            val stderr = process.errorStream.reader().readLines().filter { it.isNotBlank() }
            val exitCode = process.exitValue()
            return ProcessResult(stdout, stderr, exitCode)
        }
    }
}
