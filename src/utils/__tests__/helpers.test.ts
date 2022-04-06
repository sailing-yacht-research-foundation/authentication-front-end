import { parseKeyword } from "utils/helpers";

describe('Parse keyword when doing search', () => {
    it('should escape special characters', done => {
      const keyword = 'J/80 North American Championship 2021 - Race Day 3 - Race 1';
      const expectedResult = 'name:(J\\/80~2 North~2 American~2 Championship~2 2021~2 -~2 Race~2 Day~2 3~2 -~2 Race~2 1~2)';
      expect(parseKeyword(keyword)).toBe(expectedResult);
      done();
    });

    it('Should consider single keyword is the name criteria', done => {
        const keyword = 'Nottingham yatch race.';
        const expectedResult = 'name:(Nottingham~2 yatch~2 race.~2)';
        expect(parseKeyword(keyword)).toBe(expectedResult);
        done();
    });

    it('Should parse name criteria first if it\'s not provided', done => {
        const keyword = 'Nottingham yatch race boat_names: limay';
        const expectedResult = '(name:(Nottingham~2 yatch~2 race~2))^3 AND (boat_names:(limay~2))^2';
        expect(parseKeyword(keyword)).toBe(expectedResult);
        done();
    });

    it('should parse all fields criteria as multiple fields with points priority', done => {
        const keyword = 'all_fields: 2018 yatch race ';
        const expectedResult = '(name:(2018~2 yatch~2 race~2))^3 OR (start_city:(2018~2 yatch~2 race~2))^2 OR (start_country:(2018~2 yatch~2 race~2))^2 OR (boat_names:(2018~2 yatch~2 race~2))^2 OR (boat_models:(2018~2 yatch~2 race~2))^2 OR (handicap_rules:(2018~2 yatch~2 race~2))^2 OR (source:(2018~2 yatch~2 race~2))^2 OR (unstructured_text:(2018~2 yatch~2 race~2))^2';
        expect(parseKeyword(keyword)).toBe(expectedResult);
        done();
    });

    it('should not include white space in after parse if the search keyword include it', done => {
        const keyword = ' syrf race';
        const expectedResult = 'name:(syrf~2 race~2)';
        expect(parseKeyword(keyword)).toBe(expectedResult);
        done();
    });

    it('should parse specific field other name field', done => {
        const keyword = 'start_city:italy';
        const expectedResult = 'start_city:(italy~2)';
        expect(parseKeyword(keyword)).toBe(expectedResult);
        done(); 
    });
  });