/**
 * @since 0.1.0
 */

import * as Sum from "@unsplash/sum-types"
import { Eq, fromEquals } from "fp-ts/Eq"
import { Ord, fromCompare } from "fp-ts/Ord"
import { Show } from "fp-ts/Show"
import { Ord as ordString } from "fp-ts/string"

// We must add the `any` type argument or it won't distribute over unions for
// some reason.
/* eslint-disable @typescript-eslint/no-explicit-any */
type Tag<A> = A extends Sum.Member<infer B, any> ? B : never
type Value<A> = A extends Sum.Member<any, infer B> ? B : never
/* eslint-enable @typescript-eslint/no-explicit-any */

// We're going to be defining a series of very similar-looking mapped types
// without abstraction owing to TypeScript's lack of support for higher-kinded
// types i.e. passing generics as type arguments.

type Eqs<A extends Sum.AnyMember> = {
  readonly [B in A as Value<B> extends null ? never : Tag<B>]: Eq<Value<B>>
}

type Ords<A extends Sum.AnyMember> = {
  readonly [B in A as Value<B> extends null ? never : Tag<B>]: Ord<Value<B>>
}

type Shows<A extends Sum.AnyMember> = {
  readonly [B in A as Value<B> extends null ? never : Tag<B>]: Show<Value<B>>
}

/**
 * Given an `Eq` instance for each member of `A` for which there's a value,
 * returns an `Eq` instance for all `A`.
 *
 * @example
 * import { Member, create } from '@unsplash/sum-types'
 * import { getEq } from '@unsplash/sum-types-fp-ts'
 * import * as Num from 'fp-ts/number'
 *
 * type Weather
 *   = Member<'Sun'>
 *   | Member<'Rain', number>
 *
 * const { mk: { Sun, Rain }, match } = create<Weather>()
 *
 * const eqWeather = getEq<Weather>({
 *   Rain: Num.Eq,
 * })
 *
 * assert.strictEqual(eqWeather.equals(Rain(1), Rain(1)), true)
 * assert.strictEqual(eqWeather.equals(Rain(1), Sun()), false)
 * assert.strictEqual(eqWeather.equals(Rain(1), Rain(2)), false)
 *
 * @since 0.1.0
 */
export const getEq = <A extends Sum.AnyMember>(eqs: Eqs<A>): Eq<A> =>
  fromEquals((x, y) => {
    const [xk, xv] = Sum.serialize(x)
    const [yk, yv] = Sum.serialize(y)

    // eslint-disable-next-line functional/no-conditional-statement
    if (xk !== yk) return false

    const eq = eqs[xk as keyof typeof eqs]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return eq === undefined || eq.equals(xv as any, yv as any)
  })

/**
 * Given an `Ord` instance for each member of `A` for which there's a value,
 * returns an `Ord` instance for all `A`.
 *
 * Note that whereas Haskell derives `Ord` across members based upon definition
 * order, this function instead does so alphabetically.
 *
 * @example
 * import { Member, create } from '@unsplash/sum-types'
 * import { getOrd } from '@unsplash/sum-types-fp-ts'
 * import * as Num from 'fp-ts/number'
 *
 * type Weather
 *   = Member<'Sun'>
 *   | Member<'Rain', number>
 *
 * const { mk: { Sun, Rain }, match } = create<Weather>()
 *
 * const ordWeather = getOrd<Weather>({
 *   Rain: Num.Ord,
 * })
 *
 * assert.strictEqual(ordWeather.compare(Rain(1), Rain(1)), 0)
 * assert.strictEqual(ordWeather.compare(Rain(1), Sun()), -1)
 * assert.strictEqual(ordWeather.compare(Rain(1), Rain(2)), -1)
 * assert.strictEqual(ordWeather.compare(Rain(2), Rain(1)), 1)
 *
 * @since 0.1.0
 */
export const getOrd = <A extends Sum.AnyMember>(ords: Ords<A>): Ord<A> =>
  fromCompare((x, y) => {
    const [xk, xv] = Sum.serialize(x)
    const [yk, yv] = Sum.serialize(y)

    // eslint-disable-next-line functional/no-conditional-statement
    if (xk !== yk) return ordString.compare(xk, yk)

    const ord = ords[xk as keyof typeof ords]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ord === undefined ? 0 : ord.compare(xv as any, yv as any)
  })

/**
 * Given a `Show` instance for each member of `A` for which there's a value,
 * returns a `Show` instance for all `A`.
 *
 * @example
 * import { Member, create } from '@unsplash/sum-types'
 * import { getShow } from '@unsplash/sum-types-fp-ts'
 * import * as Num from 'fp-ts/number'
 *
 * type Weather
 *   = Member<'Sun'>
 *   | Member<'Rain', number>
 *
 * const { mk: { Sun, Rain }, match } = create<Weather>()
 *
 * const showWeather = getShow<Weather>({
 *   Rain: Num.Show,
 * })
 *
 * assert.strictEqual(showWeather.show(Sun()), 'Sun')
 * assert.strictEqual(showWeather.show(Rain(1)), 'Rain 1')
 *
 * @since 0.1.0
 */
export const getShow = <A extends Sum.AnyMember>(shows: Shows<A>): Show<A> => ({
  show: x => {
    const [k, v] = Sum.serialize(x)

    // We don't have full runtime information about `A`, so we have to pick the
    // lesser evil between:
    //   1. Test for the member tag in `shows`, and hope the consumer hasn't
    //      supplied any extras. (This is what we're doing.)
    //   2. Test the member value against `null`, and hope the consumer hasn't
    //      defined a member for which the value actually can tangibly be `null`
    //      e.g. `Member<'Rain', number | null>`.
    return k in shows
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        `${k} ${shows[k as keyof typeof shows].show(v as any)}`
      : k
  },
})
