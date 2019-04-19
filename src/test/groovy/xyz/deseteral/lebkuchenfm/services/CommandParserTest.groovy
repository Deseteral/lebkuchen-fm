package xyz.deseteral.lebkuchenfm.services

import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class CommandParserTest extends Specification {
    def 'should parse #title'() {
        when:
        def command = CommandParser.parse(text)

        then:
        command.present
        command.get().key == key
        command.get().args == args

        where:
        title                                | text                          || key      | args
        'simple command'                     | '/fm skip'                    || 'skip'   | []
        'command with single argument'       | '/fm queue youtube-id'        || 'queue'  | ['youtube-id']
        'command with many arguments'        | '/fm search some test phrase' || 'search' | ['some', 'test', 'phrase']
        'command with additional whitespace' | ' /fm  search  some   test  phrase  '   || 'search'  | ['some', 'test', 'phrase']
    }

    def 'should not parse #title'() {
        when:
        def command = CommandParser.parse(text)

        then:
        !command.present

        where:
        title                          | text
        'string that is not a command' | 'some test text'
        'empty string'                 | ''
        'null'                         | null
    }
}
