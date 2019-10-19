package xyz.deseteral.lebkuchenfm.domain.commands.processors

import spock.lang.Specification
import spock.lang.Unroll
import xyz.deseteral.lebkuchenfm.domain.commands.model.Command
import xyz.deseteral.lebkuchenfm.domain.x.XSoundService

class AddXCommandProcessorTest extends Specification {
    @Unroll
    def 'should not accept command with #title'() {
        given:
        def processor = new AddXCommandProcessor(Mock(XSoundService))

        when:
        def response = processor.process(new Command('addx', args, args.join(' ')))

        then:
        response.response == 'Musisz podać nazwę i URL (`addx sound name|url`)'

        where:
        title                      | args
        'no args'                  | []
        'one arg'                  | ['test']
        'one arg and empty string' | ['test|']
        'two whitespaces'          | [' | ']
        'two empty strings'        | ['|']
        'three or more args'       | ['test|url|garbage']
    }
}
