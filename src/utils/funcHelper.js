module.exports.getRandomNumber = function(endNumber) {
    const today = new Date();
    const seed = today.toISOString().slice(0, 10);
    const seedInt = parseInt(seed.replace(/-/g, ''), 10);
    const random = (seedInt * 9301 + 49297) % 233280;
    const randomNumber = Math.floor(random / 233280 * endNumber) + 1;
    return randomNumber;
  };
  