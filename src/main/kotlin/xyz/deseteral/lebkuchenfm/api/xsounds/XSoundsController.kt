package xyz.deseteral.lebkuchenfm.api.xsounds

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import xyz.deseteral.lebkuchenfm.api.xsounds.model.XSoundsDto
import xyz.deseteral.lebkuchenfm.domain.x.XSoundService

@RestController
@RequestMapping("/xsounds")
class XSoundsController(val xSoundService: XSoundService) {

    @GetMapping
    fun listAll(): XSoundsDto {
        return XSoundsDto(xSoundService.getAllXSounds())
    }
}
