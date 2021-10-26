/* eslint-disable functional/functional-parameters */

import fc from "fast-check"
import * as Sum from "@unsplash/sum-types"
import { getEq, getOrd, getShow } from "../../src/index"
import { flow } from "fp-ts/function"
import * as Eq from "fp-ts/Eq"
import * as Ord from "fp-ts/Ord"
import * as Num from "fp-ts/number"
import * as Str from "fp-ts-std/String"

describe("index", () => {
  type S =
    | Sum.Member<"A", number>
    | Sum.Member<"B">
    | Sum.Member<"C", number>
    | Sum.Member<"D">
  const {
    mk: { A, B, C, D },
  } = Sum.create<S>()

  describe("getEq", () => {
    const magicNumberEq = Eq.fromEquals<number>(
      (x, y) => x === 42 || y === 42 || x === y,
    )

    const f = getEq<S>({
      A: Num.Eq,
      C: magicNumberEq,
    }).equals

    it("always returns false on different members", () => {
      expect(f(A(1), C(1))).toBe(false)
      expect(f(B(), C(1))).toBe(false)
      expect(f(B(), D())).toBe(false)
    })

    it("compares same members using provided Eq instance", () => {
      expect(f(A(1), A(1))).toBe(true)
      expect(f(C(1), C(2))).toBe(false)
      expect(f(A(1), A(42))).toBe(false)
      expect(f(C(1), C(1))).toBe(true)
      expect(f(C(1), C(2))).toBe(false)
      expect(f(C(1), C(42))).toBe(true)
    })
  })

  describe("getOrd", () => {
    const f = getOrd<S>({
      A: Num.Ord,
      C: Ord.reverse(Num.Ord),
    }).compare

    const LT = -1
    const EQ = 0
    const GT = 1

    // A sanity check... I can never remember which argument is compared against
    // which!
    expect(Num.Ord.compare(1, 2)).toBe(LT)

    it("compares different members alphabetically", () => {
      expect(f(B(), D())).toBe(LT)
      expect(f(D(), B())).toBe(GT)

      fc.assert(
        fc.property(fc.integer(), fc.integer(), (x, y) => {
          expect(f(A(x), C(y))).toBe(LT)
          expect(f(A(y), C(x))).toBe(LT)
          expect(f(A(x), B())).toBe(LT)
          expect(f(C(x), A(y))).toBe(GT)
          expect(f(C(y), A(x))).toBe(GT)
          expect(f(B(), A(x))).toBe(GT)
        }),
      )
    })

    it("considers same members without values equivalent", () => {
      expect(f(B(), B())).toBe(EQ)
    })

    it("compares same members with values using provided Ord instance", () => {
      expect(f(A(1), A(2))).toBe(LT)
      expect(f(C(1), C(2))).toBe(GT)
    })
  })

  describe("getShow", () => {
    const f = getShow<S>({
      A: Num.Show,
      C: { show: flow(Num.Show.show, Str.reverse) },
    }).show

    it("outputs members without values as member names alone", () => {
      expect(f(B())).toBe("B")

      const AnyValuelessSum = Sum.create<Sum.Member<string>>()
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), x => {
          expect(getShow({}).show(AnyValuelessSum.mk[x]())).toBe(x)
        }),
      )
    })

    it("outputs members with values using provived Show instance", () => {
      expect(f(A(42))).toBe("A 42")
      expect(f(C(42))).toBe("C 24")
    })
  })
})
