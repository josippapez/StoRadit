import { MemoryRouter as Router, Route, Switch } from 'react-router-dom';
import TodoApp from './Components/TodoApp';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={TodoApp} />
      </Switch>
    </Router>
  );
}
