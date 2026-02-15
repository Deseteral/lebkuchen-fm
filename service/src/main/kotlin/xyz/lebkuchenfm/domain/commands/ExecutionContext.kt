package xyz.lebkuchenfm.domain.commands

import xyz.lebkuchenfm.domain.auth.UserSession

data class ExecutionContext(val session: UserSession, val commandPrompt: String?)
