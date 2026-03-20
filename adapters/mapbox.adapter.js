const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')

function createMapboxAdapter(token) {
  const geocoder = mbxGeocoding({ accessToken: token })
  return {
    async forwardGeocodeSingle(query) {
      if (!query || !query.trim()) {
        const err = new Error('Location is required')
        err.status = 400
        throw err
      }
      const resp = await geocoder.forwardGeocode({ query, limit: 1 }).send()
      const feature = resp && resp.body && resp.body.features && resp.body.features[0]
      if (!feature || !feature.geometry) {
        const err = new Error('Could not resolve location')
        err.status = 400
        throw err
      }
      return feature.geometry
    },
  }
}

module.exports = { createMapboxAdapter }
