/**
 * Created by huanli<klx211@gmail.com> on 11/19/14.
 *
 * Variable prefixes' meanings:
 * -------------------------------------------------------------------------
 * --- The prefix of a variable's name reveals the type of data it holds ---
 * -------------------------------------------------------------------------
 *
 * a: Array
 * b: Boolean
 * d: DOM
 * f: Function
 * l: List(an array-like object)
 * n: Number
 * o: Object
 * r: Regular expression
 * s: String
 * x: More than one type
 *  : Special case or NOT my code
 *
 * *** These prefixes can be concatenated to indicate that the variable can
 *         hold the specified types of data ***
 */

describe('An EventEmitter', function() {
    var nPermanent = 0,
        nTemporary = 0,
        sPermanentEvent = 'permanent_event',
        sTemporaryEvent = 'temporary_event',
        sShortcutEvent = 'shortcut_event',
        fPermanentListener = function() {
            return ++nPermanent;
        },
        fTemporaryListener = function() {
            return ++nTemporary;
        },
        fShortcutListener = function() {},
        eventEmitter = EventEmitter.newInstance();

    it('can add listener', function() {
        eventEmitter.addListener(sPermanentEvent, fPermanentListener);
        expect(eventEmitter.listeners(sPermanentEvent)).toBe(1);
        expect(eventEmitter.listeners(sShortcutEvent)).toBe(0);
        expect(eventEmitter.listeners(sTemporaryEvent)).toBe(0);
    });

    it('can add listener with shortcut on()', function() {
        eventEmitter.on(sShortcutEvent, fShortcutListener);
        expect(eventEmitter.listeners(sPermanentEvent)).toBe(1);
        expect(eventEmitter.listeners(sShortcutEvent)).toBe(1);
        expect(eventEmitter.listeners(sTemporaryEvent)).toBe(0);
    });

    it('can add a run-once listener', function() {
        eventEmitter.once(sTemporaryEvent, fTemporaryListener);
        expect(eventEmitter.listeners(sPermanentEvent)).toBe(1);
        expect(eventEmitter.listeners(sShortcutEvent)).toBe(1);
        expect(eventEmitter.listeners(sTemporaryEvent)).toBe(1);
    });

    it('can emit once', function() {
        eventEmitter.emit(sTemporaryEvent);
        expect(nTemporary).toBe(1);
        expect(eventEmitter.listeners(sPermanentEvent)).toBe(1);
        expect(eventEmitter.listeners(sShortcutEvent)).toBe(1);
        expect(eventEmitter.listeners(sTemporaryEvent)).toBe(0);
    });

    it('can emit permanent', function() {
        eventEmitter.emit(sPermanentEvent);
        expect(nPermanent).toBe(1);
        expect(eventEmitter.listeners(sPermanentEvent)).toBe(1);
    });

    it('can remove listeners', function() {
        eventEmitter.removeListener(sPermanentEvent, fPermanentListener);
        expect(eventEmitter.listeners(sPermanentEvent)).toBe(0);
        expect(eventEmitter.listeners(sShortcutEvent)).toBe(1);
    });

    it('can remove all listeners', function() {
        eventEmitter.removeAllListeners();
        expect(eventEmitter.listeners(sPermanentEvent)).toBe(0);
        expect(eventEmitter.listeners(sShortcutEvent)).toBe(0);
        expect(eventEmitter.listeners(sTemporaryEvent)).toBe(0);
    })
});
