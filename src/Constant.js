/**
 * Created by MinhTrung on 11/1/2018.
 */
const NO_DELAY = 0;
const EVERY_FRAME = 0;
const OFFSET_TOUCH_JOYSTICK = 20; //pixel
const MAX_SENSOR_JOYSTICK = 400; //pixel
const RECOVERY_TIME_PER_HEART = 30*60;//millisecond second to get one heart
const MAX_HEARTS = 5;//hearts max
const UPDATE_ONE_SECOND = 1;
const ONE_SECOND = 1000;
const ONCE_SECOND_HALF = 1500;
const TWO_SECOND = 2000;
const HEARTS_EACH_GAME= 1;

var DIR = {
    UNKNOWN:-1,
    UP:0,
    DOWN:1,
    LEFT:2,
    RIGHT:3
};
const TEXT_HEARTS = '💓';
const TEXT_GOLD = "💵";
const TEXT_BOOM = '💣';
const TEXT_RANGE = '🔥';
const TEXT_SPEED = '👟';
const TEXT_MAIL = '🖂';
const TEXT_SETTING = '🔧';
const TEXT_NUM = [
    '\u24EA',
    '\u2460',
    '\u2461',
    '\u2462',
    '\u2463',
    '\u2464',
    '\u2465',
    '\u2466',
    '\u2467',
    '\u2468',
    '\u2469',
    '\u246A',
    '\u246B',
    '\u246C',
    '\u246D',
    '\u246E',
    '\u246F',
    '\u2470',
    '\u2471',
    '\u2472',
    '\u2473',
    '∞'
];