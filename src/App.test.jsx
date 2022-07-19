import renderer from 'react-test-renderer';
import { expect, it } from 'vitest';
import App from './App';

function toJson(component) {
  const result = component.toJSON();

  expect(result).toBeDefined();
  expect(result).not.toBeInstanceOf(Array);

  return result;
}

it('renders without crashing', () => {
  const component = renderer.create(<App />);

  let tree = toJson(component);

  expect(tree).toMatchSnapshot();
});
