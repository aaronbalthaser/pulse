# Panel Component

The panel component is a generic container component wrapper for any number of inner components. It contains public methods which control and update the visual state of the component and its inner components. General characteristics of the component is its ability to animate from closed and open states and fold and unfolded states.

### Input Properties:

#### Required
- name: {string} - unique string value used to map the panel instance to the instance stored in the panel service
- postion: {string} - 'left' or 'right' will postion the sidebar on the respected side of the container

#### Optional

- foldedWidth {number} - sets the width of the component when its in folded state while lockedOpen is enabled and active
- lockedOpen {string} - value passed to media observer isActive method sets the observable response for the associated media queries, ie., gt-sm or gt-md.

### Public Methods:

Pul
``
foldTemporarily
``

```

```

