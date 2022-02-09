import { makeSuite, TestEnv } from '../helpers/make-suite';
import { ZERO_ADDRESS } from '@aave/deploy-v3';

const { expect } = require('chai');

makeSuite('AaveIncentivesControllerV2 setDistributionEnd', (testEnv: TestEnv) => {
  it('Revert at setDistributionEnd if not emissionManager', async () => {
    const {
      rewardsController,
      users: [user1],
    } = testEnv;

    await expect(
      rewardsController.connect(user1.signer).setDistributionEnd(ZERO_ADDRESS, ZERO_ADDRESS, 0)
    ).to.be.revertedWith('ONLY_EMISSION_MANAGER');
  });
  it('Update distribution end of a rewarded asset', async () => {
    const { rewardsController, deployer, aDai, stakedAave } = testEnv;

    const action = await rewardsController
      .connect(deployer.signer)
      .setDistributionEnd(aDai.address, stakedAave.address, '1010');

    await expect(action)
      .to.emit(rewardsController, 'AssetConfigUpdated')
      .withArgs(aDai.address, stakedAave.address, '0', '1010');

    const afterData = await rewardsController.getRewardsData(aDai.address, stakedAave.address);

    expect(afterData[3].toString()).to.be.equal('1010');
  });
});
