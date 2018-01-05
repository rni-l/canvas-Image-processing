const filterValue = [
  {
    name: 'HSLAdjustment',
    chooseValue: ['h', 's', 'l'],
    range: [{
      min: -180,
      max: 180,
      first: 0
    }, {
      min: -100,
      max: 100,
      first: 0
    }, {
      min: -100,
      max: 100,
      first: 0
    }]
  }, {
    name: 'GrayScale',
    chooseValue: [],
    range: []
  }, {
    name: 'Gamma',
    chooseValue: ['g'],
    range: [{
      min: 0,
      max: 3,
      first: 1
    }]
  }, {
    name: 'BrightnessContrastGimp',
    chooseValue: ['b', 'c'],
    range: [{
      min: -100,
      max: 100,
      first: 30
    }, {
      min: -100,
      max: 100,
      first: 30
    }]
  }, {
    name: 'Edge',
    chooseValue: [],
    range: []
  }, {
    name: 'Emboss',
    chooseValue: [],
    range: []
  }, {
    name: 'Invert',
    chooseValue: [],
    range: []
  }, {
    name: 'Oil',
    chooseValue: ['r', 'l'],
    range: [{
      min: 1,
      max: 5,
      first: 2
    }, {
      min: 1,
      max: 255,
      first: 50
    }]
  }, {
    name: 'Solarize',
    chooseValue: [],
    range: []
  }, {
    name: 'Twril',
    chooseValue: ['cx', 'cy', 'r', 'angle', 'edge', 'smooth'],
    range: [{
      min: 0.5,
      max: 0.5,
      first: 0.5
    }, {
      min: 0.5,
      max: 0.5,
      first: 0.5
    }, {
      min: 10,
      max: 200,
      first: 100
    }, {
      min: -720,
      max: 720,
      first: 100
    }, {
      min: 0,
      max: 0,
      first: 'Clamp'
    }, {
      min: 1,
      max: 1,
      first: 1
    }]
  }
]

export default {
  filterValue: filterValue
}
