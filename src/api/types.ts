export type NextRacesResponse = {
  status: number
  message: string
  data: {
    next_to_go_ids: string[]
    race_summaries: { [key: string]: RaceSummary }
  }
}

export type RaceSummary = {
  race_id: string
  race_name: string
  race_number: number
  meeting_id: string
  meeting_name: string
  category_id: string
  advertised_start: {
    seconds: number
  }
  race_form: RaceForm
  venue_id: string
  venue_name: string
  venue_state: string
  venue_country: string
}

type RaceForm = {
  distance: number
  distance_type: {
    id: string
    name: string
    short_name: string
  }
  distance_type_id: string
  track_condition: {
    id: string
    name: string
    short_name: string
  }
  track_condition_id: string
  weather: {
    id: string
    name: string
    short_name: string
    icon_uri: string
  }
  weather_id: string
  race_comment: string
  additional_data: string
  generated: number
  silk_base_url: string
  race_comment_alternative: string
}
