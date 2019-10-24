package xyz.deseteral.lebkuchenfm.domain.x

class SoundAlreadyExistsException(soundName: String)
    : RuntimeException("Sound with name $soundName already exists")
