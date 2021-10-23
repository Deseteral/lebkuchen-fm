interface App {
  name: string,
  icon: string,
  main: (appDefinition: App) => void,
}

export default App;
