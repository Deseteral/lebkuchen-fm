package xyz.lebkuchenfm.domain.commands

import xyz.lebkuchenfm.domain.auth.Scope

data class ExecutionContext(val username: String, val grantedScopes: Set<Scope>, val commandPrompt: String?)
