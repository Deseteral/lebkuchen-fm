import * as React from 'react';
import styled from 'styled-components';
import { Log } from 'lebkuchen-fm-service';
import { LogLine } from './LogLine';
import { Section } from './Section';

const RelativeContainer = styled.div`
  position: relative;
`;

const Container = styled.div`
  border: 2px solid;
  border-style: inset;
  padding: 8px;
  margin: 8px;
  height: 450px;
  background: white;
  overflow: scroll;
`;

const ScrollDownButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 30px;
  border: none;
  border-radius: 0;
  min-height: 23px;
  min-width: 75px;
  padding: 0 12px;
  background: silver;
  box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px grey, inset 2px 2px #dfdfdf;
  font-family: sans-serif;
  font-size: 13px;

  &:active {
    box-shadow: inset -1px -1px #fff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px grey;
    padding: 2px 11px 0 13px;
  }
`;

interface LogsProps {
  logs: Log[],
}

function Logs({ logs }: LogsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [updateScroll, setUpdateScroll] = React.useState<boolean>(false);
  const [showScrollDownButton, setShowScrollDownButton] = React.useState<boolean>(true);

  const scrollDown = (): void => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        left: 0,
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const isScrolledToBottom = (): boolean => {
    if (!containerRef.current) {
      return false;
    }
    const {
      scrollHeight,
      scrollTop,
      clientHeight,
    } = containerRef.current;

    return scrollHeight - scrollTop - clientHeight < 25;
  };

  const autoScrollToBottom = (): void => {
    const scrolledToBottom = isScrolledToBottom();

    if (updateScroll && !scrolledToBottom) {
      setUpdateScroll(false);
      setShowScrollDownButton(true);
      return;
    }

    if (!updateScroll && scrolledToBottom) {
      setUpdateScroll(true);
      setShowScrollDownButton(false);
    }
  };

  React.useEffect(() => {
    if (updateScroll) {
      scrollDown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs]);

  return (
    <Section header="Logs">
      <RelativeContainer>
        <Container ref={containerRef} onScroll={autoScrollToBottom}>
          <table>
            <tbody>
              {logs.map((log) => (<LogLine log={log} key={`${log.datetime}${log.message}`} />))}
            </tbody>
          </table>
          {showScrollDownButton && (
            <ScrollDownButton onClick={scrollDown}>
              Scroll Down
            </ScrollDownButton>
          )}
        </Container>
      </RelativeContainer>
    </Section>
  );
}

export { Logs, LogsProps };
