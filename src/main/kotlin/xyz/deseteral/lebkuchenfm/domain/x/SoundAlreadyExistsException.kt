package xyz.deseteral.lebkuchenfm.domain.x

import java.lang.RuntimeException

class SoundAlreadyExistsException(soundName: String)
    : RuntimeException("Sound with name $soundName already exists")
