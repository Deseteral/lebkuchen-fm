package xyz.lebkuchenfm.domain.commands

import xyz.lebkuchenfm.domain.sessions.UserSession

data class ExecutionContext(val session: UserSession)
