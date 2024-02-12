/*
 * SPDX-FileCopyrightText: 2021 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Unlicense OR CC0-1.0
 */


#include <stdio.h>
#include <stdlib.h>
#include <string.h>


/* Attributes State Machine */
enum
{
    LC_IDX_SVC,
    LC_IDX_BRIG_CHAR,
    LC_IDX_BRIG_CHAR_VAL,
    LC_IDX_BRIG_CHAR_NTF_CFG,

    LC_IDX_CFG_CHAR,
    LC_IDX_CFG_CHAR_VAL,

    LC_IDX_NB,
};
