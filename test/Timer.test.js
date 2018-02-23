const Timer = require('../lib/Timer');
const assert = require('assert');
const sinon = require('sinon');
const PropertiesService = require('./mocks/PropertiesService');

describe('timers', function() {
  beforeEach(function() {
    this.now = new Date().getTime();
    this.clock = sinon.useFakeTimers(this.now);
    this.timer = new Timer();
    this.userProperties = PropertiesService.getUserProperties();
  });
  afterEach(function() {
    this.clock.restore();
  });

  describe('START_TIME property', function() {
    it('should update when initialized', function() {
      assert.equal(this.timer.START_TIME, this.now);
    });
  });

  describe('timeIsUp()', function() {
    it('should begin as false', function() {
      assert.equal(this.timer.timeIsUp, false);
    });
    it('should be false when currTime is less than 4.7 minutes after START_TIME', function() {
      assert.equal(this.timer.timeIsUp, false);
      this.clock.tick(4.6 * 1000 * 60);
      this.timer.update(this.userProperties);
      assert.equal(this.timer.timeIsUp, false);
      assert(this.timer.canContinue(), 'timer should be able to continue');
    });

    it('should be true when currTime is greater than 4.7 minutes after START_TIME', function() {
      assert.equal(this.timer.timeIsUp, false);
      this.clock.tick(4.8 * 1000 * 60);
      this.timer.update(this.userProperties);
      assert(
        this.timer.runtime >=
          this.timer.MAX_RUNTIME
      );
      assert(!this.timer.canContinue(), 'timer should not be able to continue');
    });
  });

  it('should update stop property if userProperties.stop is true', function() {
    this.userProperties.getProperties().stop = false;
    this.timer.update(this.userProperties);
    assert(this.timer.canContinue(), 'stopped when stop flag is false');

    this.userProperties.getProperties().stop = 'true';
    this.timer.update(this.userProperties);
    assert(!this.timer.canContinue(), 'did not stop when stop flag is true');

    // reset stop flag
    this.userProperties.getProperties().stop = false;
  });
});
