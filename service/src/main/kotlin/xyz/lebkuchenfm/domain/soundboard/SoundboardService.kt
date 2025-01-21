package xyz.lebkuchenfm.domain.soundboard

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import xyz.lebkuchenfm.domain.eventstream.Event
import xyz.lebkuchenfm.domain.eventstream.EventStream
import xyz.lebkuchenfm.domain.xsounds.XSoundsService

class SoundboardService(
    private val xSoundsService: XSoundsService,
    private val eventStream: EventStream<*>,
) {
    suspend fun playXSound(soundName: String): Result<Unit, PlayXSoundError> {
        val xSound = xSoundsService.getByName(soundName)
            ?: return Err(PlayXSoundError.SoundNotFound)

        eventStream.sendToEveryone(Event.PlayXSound(soundUrl = xSound.url))
        xSoundsService.markAsPlayed(xSound.name)

        return Ok(Unit)
    }

    sealed class PlayXSoundError {
        data object SoundNotFound : PlayXSoundError()
    }
}
