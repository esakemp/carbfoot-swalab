import React from 'react'
import { storiesOf } from '@storybook/react'
import EmissionsMap from './EmissionsMap'

const data = [
    { code: 'FIN', value: 100.425 },
    { code: 'SWE', value: 200.434 }
]

storiesOf('EmissionsMap', module)
  .add('default', () => <EmissionsMap data={data} />)