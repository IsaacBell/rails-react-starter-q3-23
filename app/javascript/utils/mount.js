import React from 'react';
import ReactDOM from 'react-dom';

export default function mount(components = {}) {
  const mountPoints = document.querySelectorAll('[data-react-component]');
  mountPoints.forEach((mountPoint) => {
    const { dataset } = mountPoint;
    const componentName = dataset.reactComponent;
    const Component = components[componentName];

    if (Component) {
      const props = JSON.parse(dataset.props);
      ReactDOM.render(<Component {...props} />, mountPoint);
    }
  });
}
