---
title: index.ts
nav_order: 1
parent: Modules
---

## index overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [getEq](#geteq)
  - [getOrd](#getord)
  - [getShow](#getshow)

---

# utils

## getEq

Given an `Eq` instance for each member of `A` for which there's a value,
returns an `Eq` instance for all `A`.

**Signature**

```ts
export declare const getEq: <A extends Sum.AnyMember>(eqs: Eqs<A>) => Eq<A>
```

**Example**

```ts
import { Member, create } from '@unsplash/sum-types'
import { getEq } from '@unsplash/sum-types-fp-ts'
import * as Num from 'fp-ts/number'

type Weather = Member<'Sun'> | Member<'Rain', number>

const {
  mk: { Sun, Rain },
  match,
} = create<Weather>()

const eqWeather = getEq<Weather>({
  Rain: Num.Eq,
})

assert.strictEqual(eqWeather.equals(Rain(1), Rain(1)), true)
assert.strictEqual(eqWeather.equals(Rain(1), Sun()), false)
assert.strictEqual(eqWeather.equals(Rain(1), Rain(2)), false)
```

Added in v0.1.0

## getOrd

Given an `Ord` instance for each member of `A` for which there's a value,
returns an `Ord` instance for all `A`.

Note that whereas Haskell derives `Ord` across members based upon definition
order, this function instead does so alphabetically.

**Signature**

```ts
export declare const getOrd: <A extends Sum.AnyMember>(ords: Ords<A>) => Ord<A>
```

**Example**

```ts
import { Member, create } from '@unsplash/sum-types'
import { getOrd } from '@unsplash/sum-types-fp-ts'
import * as Num from 'fp-ts/number'

type Weather = Member<'Sun'> | Member<'Rain', number>

const {
  mk: { Sun, Rain },
  match,
} = create<Weather>()

const ordWeather = getOrd<Weather>({
  Rain: Num.Ord,
})

assert.strictEqual(ordWeather.compare(Rain(1), Rain(1)), 0)
assert.strictEqual(ordWeather.compare(Rain(1), Sun()), -1)
assert.strictEqual(ordWeather.compare(Rain(1), Rain(2)), -1)
assert.strictEqual(ordWeather.compare(Rain(2), Rain(1)), 1)
```

Added in v0.1.0

## getShow

Given a `Show` instance for each member of `A` for which there's a value,
returns a `Show` instance for all `A`.

**Signature**

```ts
export declare const getShow: <A extends Sum.AnyMember>(shows: Shows<A>) => Show<A>
```

**Example**

```ts
import { Member, create } from '@unsplash/sum-types'
import { getShow } from '@unsplash/sum-types-fp-ts'
import * as Num from 'fp-ts/number'

type Weather = Member<'Sun'> | Member<'Rain', number>

const {
  mk: { Sun, Rain },
  match,
} = create<Weather>()

const showWeather = getShow<Weather>({
  Rain: Num.Show,
})

assert.strictEqual(showWeather.show(Sun()), 'Sun')
assert.strictEqual(showWeather.show(Rain(1)), 'Rain 1')
```

Added in v0.1.0
