package xyz.deseteral.lebkuchenfm.domain;

import java.util.List;

public class Command {
    private final String key;
    private final List<String> args;

    public Command(String key, List<String> args) {
        this.key = key;
        this.args = args;
    }

    public String getKey() {
        return key;
    }

    public List<String> getArgs() {
        return args;
    }
}
