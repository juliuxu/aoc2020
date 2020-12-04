import { test, readInput } from "../utils/index"


type Field =
  'byr' |
  'iyr' |
  'eyr' |
  'hgt' |
  'hcl' |
  'ecl' |
  'pid';

const fields: Field[] = [
  'byr',
  'iyr',
  'eyr',
  'hgt',
  'hcl',
  'ecl',
  'pid',
  // 'cid': /r/,
]

type Passport = Partial<Record<Field, string>>
type Input = Passport[];

const prepareInput = (rawInput: string): Input => {
  return rawInput.split('\n\n')
    .map(line => line.replace('\n', ' '))
    .map(line => line.split(/\s/))
    .map(line => line.reduce((acc, x) => {
      const kv = x.split(':');
      acc[kv[0]] = kv[1]
      return acc;
    }, {}))
}
const input = prepareInput(readInput())

const isValid = (p: Passport, requiredFields: Field[]) => {
  for (const field of requiredFields) {
    if (!(field in p)) return false;
  }
  return true;
}

const goA = (input: Input) => {
  return input.filter(p => isValid(p, fields)).length
}

const isValid2 = (p: Passport, requiredFields: string[]) => {
  // console.log('got', p);
  for (const field of requiredFields) {
    // console.log("  key", field)
    if (!(field in p)) return false;
    const v = p[field] as string;

    /*
    byr (Birth Year) - four digits; at least 1920 and at most 2002.
    iyr (Issue Year) - four digits; at least 2010 and at most 2020.
    eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
    hgt (Height) - a number followed by either cm or in:
    If cm, the number must be at least 150 and at most 193.
    If in, the number must be at least 59 and at most 76.
    hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
    ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
    pid (Passport ID) - a nine-digit number, including leading zeroes.
    cid (Country ID) - ignored, missing or not.
    */
    if (field === 'byr') {
      const n = Number(v);
      if (n >= 1920 && n <= 2002) continue
    }
    if (field === 'iyr') {
      const n = Number(v);
      if (n >= 2010 && n <= 2020) continue
    }
    if (field === 'eyr') {
      const n = Number(v);
      if (n >= 2020 && n <= 2030) continue
    }
    if (field === 'hgt') {
      const m = v.match(/^(\d+)(cm|in)$/);
      if (m === null) return false;
      const h = Number(m[1]);
      if (m[2] === 'cm' && h >= 150 && h <= 193) continue;
      if (m[2] === 'in' && h >= 59 && h <= 76) continue;

      return false;
    }
    if (field === 'hcl') {
      if (v.match(/^#(\d|[a-f]){6}$/) !== null) continue
    }
    if (field === 'ecl') {
      if (['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(v)) continue
    }
    if (field === 'pid') {
      if (v.match(/^\d{9}$/) !== null) continue
    }

    return false;
  }
  return true;
}
const goB = (input: Input) => {
  return input.filter(p => isValid2(p, fields)).length
}

/* Tests */

// test()
const t = `ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`
const testInput = prepareInput(t);

test(goA(testInput), 2)

const tInvalid = `eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007`

const tValid = `pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719`
const testInvalid = prepareInput(tInvalid);
const testValid = prepareInput(tValid);

test(goB(testInvalid), 0)
test(goB(testValid), 4)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
