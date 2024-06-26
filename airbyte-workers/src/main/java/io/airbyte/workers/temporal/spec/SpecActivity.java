/*
 * Copyright (c) 2020-2024 Airbyte, Inc., all rights reserved.
 */

package io.airbyte.workers.temporal.spec;

import io.airbyte.config.ConnectorJobOutput;
import io.airbyte.persistence.job.models.IntegrationLauncherConfig;
import io.airbyte.persistence.job.models.JobRunConfig;
import io.temporal.activity.ActivityInterface;
import io.temporal.activity.ActivityMethod;

/**
 * SpecActivity.
 */
@ActivityInterface
public interface SpecActivity {

  @ActivityMethod
  ConnectorJobOutput run(JobRunConfig jobRunConfig, IntegrationLauncherConfig launcherConfig);

}
