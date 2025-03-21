/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

declare let buildProcess: BuildProcess;

interface BuildProcess {
  env: Env;
}

interface Env {
  CX_BASE_URL: string;
  CX_CDS: boolean;
  CX_CDC: boolean;
  CX_B2B: boolean;
  CX_CPQ: boolean;
  CX_DIGITAL_PAYMENTS: boolean;
  CX_EPD_VISUALIZATION: boolean;
  CX_S4OM: boolean;
}
