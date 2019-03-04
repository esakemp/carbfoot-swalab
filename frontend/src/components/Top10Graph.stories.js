import React from 'react'
import { storiesOf } from '@storybook/react'
import Top10Graph from './Top10Graph'

const series = [
    { name: 'China', y: 666.33 },
    { name: 'India', y: 333.33 },
    { name: 'USA', y: 333.33 },
]

storiesOf('Top10Graph', module)
  .add('default', () => <Top10Graph year="1904" series={series}/>)