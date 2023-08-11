/* eslint-disable functional/functional-parameters, functional/no-expression-statement, @typescript-eslint/no-unused-vars */

import * as Sum from "@unsplash/sum-types"
import { getEq, getOrd, getShow } from "../../src/index"
import * as Eq from "fp-ts/Eq"
import * as Ord from "fp-ts/Ord"
import * as Show from "fp-ts/Show"
import * as Num from "fp-ts/number"

type NonNullary = Sum.Member<"A1"> | Sum.Member<"A2", number>

//# getEq requires instances only for members with values
getEq<NonNullary>({ A2: Num.Eq }) // $ExpectType Eq<NonNullary>
getEq<NonNullary>({}) // $ExpectError
getEq<NonNullary>({ A2: Num.Eq as unknown as Eq.Eq<string> }) // $ExpectError
getEq<NonNullary>({ A1: Num.Eq, A2: Num.Eq }) // $ExpectError

//# getOrd requires instances only for members with values
getOrd<NonNullary>({ A2: Num.Ord }) // $ExpectType Ord<NonNullary>
getOrd<NonNullary>({}) // $ExpectError
getOrd<NonNullary>({ A2: Num.Ord as unknown as Ord.Ord<string> }) // $ExpectError
getOrd<NonNullary>({ A1: Num.Ord, A2: Num.Ord }) // $ExpectError

//# getShow requires instances only for members with values
getShow<NonNullary>({ A2: Num.Show }) // $ExpectType Show<NonNullary>
getShow<NonNullary>({}) // $ExpectError
getShow<NonNullary>({ A2: Num.Show as unknown as Show.Show<string> }) // $ExpectError
getShow<NonNullary>({ A1: Num.Show, A2: Num.Show }) // $ExpectError
