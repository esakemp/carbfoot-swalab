import React from 'react'
import { storiesOf } from '@storybook/react'
import EmissionsMap from './EmissionsMap'

storiesOf('EmissionsMap', module)
  .add('default', () => <EmissionsMap code="FIN" />)