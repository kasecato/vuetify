// @ts-nocheck
/* tslint:disable */
/* eslint-disable */
import {
  parseTimestamp,
  getDayIdentifier,
  getTimestampIdentifier,
  OFFSET_TIME,
  isTimedless,
  updateHasTime,
} from './timestamp'
import { CalendarTimestamp, CalendarEvent, CalendarEventParsed } from 'vuetify/types'

export function parseEvent (
  input: CalendarEvent,
  index: number,
  startProperty: string,
  endProperty: string,
  timed = false,
  category: string | false = false,
): CalendarEventParsed {
  const startInput = input[startProperty]
  const endInput = input[endProperty]
  const startParsed: CalendarTimestamp = parseTimestamp(startInput, true)
  const endParsed: CalendarTimestamp = (endInput ? parseTimestamp(endInput, true) : startParsed)
  const start: CalendarTimestamp = isTimedless(startInput)
    ? updateHasTime(startParsed, timed)
    : startParsed
  const end: CalendarTimestamp = isTimedless(endInput)
    ? updateHasTime(endParsed, timed)
    : endParsed
  const startIdentifier: number = getDayIdentifier(start)
  const startTimestampIdentifier: number = getTimestampIdentifier(start)
  const endIdentifier: number = getDayIdentifier(end)
  const endOffset: number = start.hasTime ? 0 : 2359
  const endTimestampIdentifier: number = getTimestampIdentifier(end) + endOffset
  const allDay: boolean = !start.hasTime

  return { input, start, startIdentifier, startTimestampIdentifier, end, endIdentifier, endTimestampIdentifier, allDay, index, category }
}

export function isEventOn (event: CalendarEventParsed, dayIdentifier: number): boolean {
  return dayIdentifier >= event.startIdentifier &&
    dayIdentifier <= event.endIdentifier &&
    dayIdentifier * OFFSET_TIME !== event.endTimestampIdentifier
}

export function isEventStart (event: CalendarEventParsed, day: CalendarTimestamp, dayIdentifier: number, firstWeekday: number): boolean {
  return dayIdentifier === event.startIdentifier || (firstWeekday === day.weekday && isEventOn(event, dayIdentifier))
}

export function isEventOverlapping (event: CalendarEventParsed, startIdentifier: number, endIdentifier: number): boolean {
  return startIdentifier <= event.endIdentifier && endIdentifier >= event.startIdentifier
}
