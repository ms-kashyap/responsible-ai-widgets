// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IDataset } from "@responsible-ai/core-ui";

export const adultCensusWithDataBalanceMeasures: IDataset = {
  categorical_features: [
    "workclass",
    "education",
    "marital-status",
    "occupation",
    "relationship",
    "race",
    "gender",
    "native-country"
  ],
  class_names: ["<=50K", ">50K"],
  dataBalanceMeasures: {
    aggregateBalanceMeasures: {
      measures: {
        atkinsonIndex: 0.7779093876726265,
        theilLIndex: 1.5046698167491577,
        theilTIndex: 1.120823106721189
      }
    },
    distributionBalanceMeasures: {
      measures: {
        race: {
          chi_sq_p_value: 0,
          chi_sq_stat: 87941.88919259237,
          inf_norm_dist: 0.6542735173981142,
          js_dist: 0.5103995242157859,
          kl_divergence: 1.055793082185159,
          total_variation_dist: 0.6542735173981142,
          wasserstein_dist: 0.2617094069592457
        },
        sex: {
          chi_sq_p_value: 0,
          chi_sq_stat: 3728.950615767329,
          inf_norm_dist: 0.16920549123184175,
          js_dist: 0.12173456308341161,
          kl_divergence: 0.058407312537739675,
          total_variation_dist: 0.16920549123184173,
          wasserstein_dist: 0.16920549123184173
        }
      }
    },
    featureBalanceMeasures: {
      features: ["race", "sex"],
      featureValues: {
        race: [
          "Asian-Pac-Islander",
          "Black",
          "Other",
          "White",
          "Amer-Indian-Eskimo"
        ],
        sex: ["Male", "Female"]
      },
      measures: {
        race: {
          "Asian-Pac-Islander__Amer-Indian-Eskimo": {
            dp: 0.14988441148890996,
            ji: 0.027642420605543186,
            krc: -5.690376027380834,
            llr: 2.0368819272610397,
            n_pmi_xy: -0.0388777079396283,
            n_pmi_y: -0.5834321363659789,
            pmi: 0.8306608483410465,
            prA: 0.2656400384985563,
            prB: 0.1157556270096463,
            s_pmi: 2.867542775602087,
            sdc: 0.026664986871071262,
            t_test: 0.033944027223891754
          },
          "Black__Amer-Indian-Eskimo": {
            dp: 0.00812401447562898,
            ji: 0.032149683251391406,
            krc: -9.020627562084012,
            llr: 2.3749057545736716,
            n_pmi_xy: 0.15441543799168173,
            n_pmi_y: -0.0476412357118281,
            pmi: 0.06782915579332904,
            prA: 0.12387964148527528,
            prB: 0.1157556270096463,
            s_pmi: 2.442734910367001,
            sdc: 0.03087802343704901,
            t_test: -0.04890133595306627
          },
          "Black__Asian-Pac-Islander": {
            dp: -0.141760397013281,
            ji: 0.00450726264584822,
            krc: -3.3302515347031774,
            llr: 0.3380238273126319,
            n_pmi_xy: 0.19329314593131003,
            n_pmi_y: 0.5357909006541508,
            pmi: -0.7628316925477174,
            prA: 0.12387964148527528,
            prB: 0.2656400384985563,
            s_pmi: -0.42480786523508574,
            sdc: 0.004213036565977747,
            t_test: -0.08284536317695802
          },
          "Other__Amer-Indian-Eskimo": {
            dp: -0.023504704500421206,
            ji: -0.00134430137313395,
            krc: 0.8897292942999737,
            llr: -0.3646431135879098,
            n_pmi_xy: 0.01554182497942902,
            n_pmi_y: 0.1594164716286668,
            pmi: -0.226969022288376,
            prA: 0.09225092250922509,
            prB: 0.1157556270096463,
            s_pmi: -0.5916121358762858,
            sdc: -0.0013342401666173085,
            t_test: -0.0027129900274572294
          },
          "Other__Asian-Pac-Islander": {
            dp: -0.17338911598933118,
            ji: -0.02898672197867714,
            krc: 6.580105321680808,
            llr: -2.4015250408489495,
            n_pmi_xy: 0.05441953291905732,
            n_pmi_y: 0.7428486079946457,
            pmi: -1.0576298706294225,
            prA: 0.09225092250922509,
            prB: 0.2656400384985563,
            s_pmi: -3.4591549114783726,
            sdc: -0.027999227037688573,
            t_test: -0.03665701725134898
          },
          Other__Black: {
            dp: -0.031628718976050185,
            ji: -0.03349398462452536,
            krc: 9.910356856383984,
            llr: -2.7395488681615814,
            n_pmi_xy: -0.1388736130122527,
            n_pmi_y: 0.2070577073404949,
            pmi: -0.29479817808170505,
            prA: 0.09225092250922509,
            prB: 0.12387964148527528,
            s_pmi: -3.034347046243287,
            sdc: -0.032212263603666316,
            t_test: 0.04618834592560904
          },
          "White__Amer-Indian-Eskimo": {
            dp: 0.14010430971741727,
            ji: 0.24493362363459345,
            krc: -14.433135043914726,
            llr: 5.286722628843161,
            n_pmi_xy: 0.5796652374708087,
            n_pmi_y: -0.5570848066927879,
            pmi: 0.7931488673346978,
            prA: 0.2558599367270636,
            prB: 0.1157556270096463,
            s_pmi: 6.079871496177859,
            sdc: 0.19518005801816418,
            t_test: 0.05325242954305594
          },
          "White__Asian-Pac-Islander": {
            dp: -0.009780101771492689,
            ji: 0.21729120302905025,
            krc: -8.742759016533892,
            llr: 3.249840701582121,
            n_pmi_xy: 0.618542945410437,
            n_pmi_y: 0.026347329673190978,
            pmi: -0.03751198100634867,
            prA: 0.2558599367270636,
            prB: 0.2656400384985563,
            s_pmi: 3.212328720575772,
            sdc: 0.16851507114709294,
            t_test: 0.019308402319164183
          },
          White__Black: {
            dp: 0.1319802952417883,
            ji: 0.21278394038320203,
            krc: -5.412507481830714,
            llr: 2.911816874269489,
            n_pmi_xy: 0.425249799479127,
            n_pmi_y: -0.5094435709809598,
            pmi: 0.7253197115413688,
            prA: 0.2558599367270636,
            prB: 0.12387964148527528,
            s_pmi: 3.6371365858108575,
            sdc: 0.1643020345811152,
            t_test: 0.1021537654961222
          },
          White__Other: {
            dp: 0.1636090142178385,
            ji: 0.24627792500772738,
            krc: -15.3228643382147,
            llr: 5.651365742431071,
            n_pmi_xy: 0.5641234124913796,
            n_pmi_y: -0.7165012783214547,
            pmi: 1.0201178896230738,
            prA: 0.2558599367270636,
            prB: 0.09225092250922509,
            s_pmi: 6.671483632054144,
            sdc: 0.1965142981847815,
            t_test: 0.05596541957051317
          }
        },
        sex: {
          Male__Female: {
            dp: 0.19627598779361355,
            ji: 0.2224127453507233,
            krc: -0.8801022847477544,
            llr: 1.731753118216254,
            n_pmi_xy: 0.0802209475794492,
            n_pmi_y: -0.7214469658118929,
            pmi: 1.0271593066283586,
            prA: 0.3057365764111978,
            prB: 0.10946058861758425,
            s_pmi: 2.758912424844613,
            sdc: 0.16148587327545963,
            t_test: 0.26218135006369214
          }
        }
      }
    }
  },
  feature_names: [
    "age",
    "workclass",
    "fnlwgt",
    "education",
    "education-num",
    "marital-status",
    "occupation",
    "relationship",
    "race",
    "gender",
    "capital-gain",
    "capital-loss",
    "hours-per-week",
    "native-country"
  ],
  features: [
    [
      50,
      "Private",
      39590,
      "HS-grad",
      9,
      "Married-civ-spouse",
      "Farming-fishing",
      "Husband",
      "White",
      "Male",
      0,
      0,
      48,
      "United-States"
    ],
    [
      24,
      "Local-gov",
      174413,
      "Bachelors",
      13,
      "Never-married",
      "Prof-specialty",
      "Not-in-family",
      "White",
      "Female",
      0,
      1974,
      40,
      "United-States"
    ],
    [
      40,
      "Private",
      132222,
      "HS-grad",
      9,
      "Never-married",
      "Other-service",
      "Not-in-family",
      "White",
      "Male",
      0,
      0,
      40,
      "United-States"
    ],
    [
      33,
      "Private",
      202046,
      "Bachelors",
      13,
      "Married-civ-spouse",
      "Exec-managerial",
      "Husband",
      "White",
      "Male",
      0,
      0,
      45,
      "United-States"
    ],
    [
      24,
      "Private",
      160261,
      "Some-college",
      10,
      "Never-married",
      "Sales",
      "Not-in-family",
      "Asian-Pac-Islander",
      "Male",
      0,
      0,
      64,
      "?"
    ],
    [
      44,
      "Private",
      201495,
      "Assoc-acdm",
      12,
      "Married-civ-spouse",
      "Exec-managerial",
      "Husband",
      "White",
      "Male",
      0,
      1977,
      50,
      "United-States"
    ],
    [
      26,
      "Self-emp-not-inc",
      33016,
      "Assoc-voc",
      11,
      "Divorced",
      "Other-service",
      "Unmarried",
      "White",
      "Female",
      0,
      0,
      55,
      "United-States"
    ],
    [
      49,
      "Private",
      390746,
      "Bachelors",
      13,
      "Married-civ-spouse",
      "Prof-specialty",
      "Husband",
      "White",
      "Male",
      0,
      1672,
      45,
      "Ireland"
    ],
    [
      40,
      "Self-emp-not-inc",
      211518,
      "Bachelors",
      13,
      "Divorced",
      "Other-service",
      "Unmarried",
      "White",
      "Female",
      0,
      0,
      20,
      "United-States"
    ],
    [
      36,
      "State-gov",
      173273,
      "Masters",
      14,
      "Never-married",
      "Prof-specialty",
      "Not-in-family",
      "Black",
      "Female",
      0,
      0,
      40,
      "United-States"
    ],
    [
      36,
      "Private",
      224541,
      "7th-8th",
      4,
      "Married-civ-spouse",
      "Handlers-cleaners",
      "Husband",
      "White",
      "Male",
      0,
      0,
      40,
      "El-Salvador"
    ],
    [
      22,
      "Private",
      202153,
      "Some-college",
      10,
      "Never-married",
      "Adm-clerical",
      "Own-child",
      "White",
      "Female",
      0,
      0,
      30,
      "United-States"
    ],
    [
      51,
      "Private",
      27539,
      "Some-college",
      10,
      "Married-civ-spouse",
      "Transport-moving",
      "Husband",
      "White",
      "Male",
      0,
      0,
      60,
      "United-States"
    ],
    [
      60,
      "Private",
      137490,
      "5th-6th",
      3,
      "Separated",
      "Handlers-cleaners",
      "Not-in-family",
      "Black",
      "Male",
      0,
      0,
      40,
      "United-States"
    ],
    [
      40,
      "Private",
      77975,
      "HS-grad",
      9,
      "Married-civ-spouse",
      "Craft-repair",
      "Husband",
      "White",
      "Male",
      0,
      0,
      40,
      "United-States"
    ],
    [
      29,
      "Private",
      485944,
      "Bachelors",
      13,
      "Never-married",
      "Sales",
      "Own-child",
      "Black",
      "Male",
      0,
      0,
      40,
      "United-States"
    ],
    [
      34,
      "Private",
      205072,
      "HS-grad",
      9,
      "Never-married",
      "Sales",
      "Not-in-family",
      "White",
      "Male",
      0,
      0,
      50,
      "United-States"
    ],
    [
      41,
      "Private",
      244522,
      "HS-grad",
      9,
      "Married-civ-spouse",
      "Craft-repair",
      "Husband",
      "White",
      "Male",
      7688,
      0,
      42,
      "United-States"
    ],
    [
      35,
      "?",
      111377,
      "Bachelors",
      13,
      "Married-civ-spouse",
      "?",
      "Husband",
      "White",
      "Male",
      0,
      0,
      50,
      "United-States"
    ],
    [
      35,
      "Private",
      250988,
      "Bachelors",
      13,
      "Married-civ-spouse",
      "Sales",
      "Husband",
      "White",
      "Male",
      0,
      0,
      40,
      "United-States"
    ],
    [
      28,
      "Private",
      110408,
      "HS-grad",
      9,
      "Married-civ-spouse",
      "Sales",
      "Husband",
      "White",
      "Male",
      0,
      0,
      45,
      "United-States"
    ],
    [
      31,
      "Private",
      463601,
      "HS-grad",
      9,
      "Never-married",
      "Handlers-cleaners",
      "Other-relative",
      "Black",
      "Male",
      0,
      0,
      40,
      "United-States"
    ],
    [
      45,
      "Self-emp-not-inc",
      165267,
      "9th",
      5,
      "Married-civ-spouse",
      "Transport-moving",
      "Husband",
      "Black",
      "Male",
      0,
      0,
      40,
      "United-States"
    ],
    [
      49,
      "Private",
      149218,
      "HS-grad",
      9,
      "Divorced",
      "Craft-repair",
      "Unmarried",
      "White",
      "Male",
      0,
      0,
      50,
      "United-States"
    ],
    [
      44,
      "Private",
      96129,
      "Bachelors",
      13,
      "Married-civ-spouse",
      "Exec-managerial",
      "Husband",
      "White",
      "Male",
      0,
      0,
      40,
      "United-States"
    ],
    [
      38,
      "Private",
      127493,
      "Assoc-acdm",
      12,
      "Widowed",
      "Sales",
      "Unmarried",
      "White",
      "Female",
      0,
      0,
      35,
      "United-States"
    ],
    [
      35,
      "Private",
      114765,
      "Masters",
      14,
      "Never-married",
      "Prof-specialty",
      "Not-in-family",
      "White",
      "Female",
      0,
      0,
      38,
      "United-States"
    ],
    [
      29,
      "Private",
      180271,
      "HS-grad",
      9,
      "Never-married",
      "Tech-support",
      "Own-child",
      "White",
      "Male",
      0,
      0,
      40,
      "United-States"
    ],
    [
      40,
      "Local-gov",
      208875,
      "Masters",
      14,
      "Divorced",
      "Prof-specialty",
      "Not-in-family",
      "White",
      "Female",
      0,
      0,
      50,
      "United-States"
    ],
    [
      34,
      "Private",
      263150,
      "Some-college",
      10,
      "Married-civ-spouse",
      "Exec-managerial",
      "Wife",
      "White",
      "Female",
      0,
      0,
      45,
      "United-States"
    ],
    [
      35,
      "Private",
      399601,
      "HS-grad",
      9,
      "Married-civ-spouse",
      "Prof-specialty",
      "Husband",
      "White",
      "Male",
      0,
      0,
      50,
      "United-States"
    ],
    [
      43,
      "Local-gov",
      256253,
      "Bachelors",
      13,
      "Married-civ-spouse",
      "Prof-specialty",
      "Husband",
      "White",
      "Male",
      0,
      0,
      55,
      "United-States"
    ],
    [
      42,
      "Federal-gov",
      88909,
      "Bachelors",
      13,
      "Married-civ-spouse",
      "Exec-managerial",
      "Husband",
      "White",
      "Male",
      0,
      0,
      40,
      "United-States"
    ],
    [
      18,
      "Private",
      150675,
      "10th",
      6,
      "Never-married",
      "Sales",
      "Own-child",
      "White",
      "Male",
      0,
      0,
      40,
      "United-States"
    ],
    [
      49,
      "Self-emp-inc",
      83444,
      "Bachelors",
      13,
      "Married-civ-spouse",
      "Sales",
      "Husband",
      "White",
      "Male",
      0,
      0,
      85,
      "United-States"
    ],
    [
      26,
      "?",
      88513,
      "Bachelors",
      13,
      "Never-married",
      "?",
      "Not-in-family",
      "White",
      "Male",
      0,
      0,
      40,
      "United-States"
    ],
    [
      47,
      "Self-emp-not-inc",
      185859,
      "HS-grad",
      9,
      "Married-civ-spouse",
      "Farming-fishing",
      "Husband",
      "White",
      "Male",
      3103,
      0,
      60,
      "United-States"
    ],
    [
      41,
      "?",
      188436,
      "HS-grad",
      9,
      "Married-civ-spouse",
      "?",
      "Husband",
      "White",
      "Male",
      0,
      0,
      20,
      "Canada"
    ],
    [
      30,
      "Private",
      183017,
      "HS-grad",
      9,
      "Divorced",
      "Machine-op-inspct",
      "Own-child",
      "White",
      "Male",
      0,
      0,
      40,
      "United-States"
    ],
    [
      26,
      "Local-gov",
      391074,
      "10th",
      6,
      "Never-married",
      "Handlers-cleaners",
      "Own-child",
      "Black",
      "Male",
      0,
      0,
      40,
      "United-States"
    ],
    [
      28,
      "Private",
      190525,
      "Bachelors",
      13,
      "Married-civ-spouse",
      "Exec-managerial",
      "Husband",
      "White",
      "Male",
      0,
      0,
      50,
      "United-States"
    ],
    [
      21,
      "Local-gov",
      402230,
      "Some-college",
      10,
      "Never-married",
      "Adm-clerical",
      "Unmarried",
      "White",
      "Male",
      0,
      0,
      36,
      "United-States"
    ],
    [
      64,
      "Private",
      186731,
      "HS-grad",
      9,
      "Widowed",
      "Adm-clerical",
      "Unmarried",
      "White",
      "Female",
      0,
      0,
      40,
      "United-States"
    ],
    [
      34,
      "Private",
      93213,
      "Masters",
      14,
      "Married-civ-spouse",
      "Other-service",
      "Husband",
      "White",
      "Male",
      0,
      0,
      30,
      "United-States"
    ],
    [
      31,
      "Private",
      323985,
      "HS-grad",
      9,
      "Married-civ-spouse",
      "Exec-managerial",
      "Wife",
      "White",
      "Female",
      0,
      0,
      40,
      "United-States"
    ],
    [
      44,
      "Private",
      98779,
      "Some-college",
      10,
      "Married-civ-spouse",
      "Craft-repair",
      "Husband",
      "White",
      "Male",
      5178,
      0,
      40,
      "United-States"
    ],
    [
      43,
      "Federal-gov",
      205675,
      "Some-college",
      10,
      "Married-civ-spouse",
      "Tech-support",
      "Husband",
      "White",
      "Male",
      0,
      0,
      75,
      "United-States"
    ],
    [
      29,
      "Private",
      197565,
      "HS-grad",
      9,
      "Married-civ-spouse",
      "Other-service",
      "Wife",
      "White",
      "Female",
      0,
      1902,
      35,
      "United-States"
    ]
  ],
  name: "Adult Census Income",
  predicted_y: [
    1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1,
    0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1
  ],
  probability_y: [
    [0.7510962272030672, 0.24890377279693277],
    [0.7802282829948453, 0.21977171700515474],
    [0.780312141589862, 0.2196878584101381],
    [0.7013425216602426, 0.2986574783397574],
    [0.780312141589862, 0.2196878584101381],
    [0.6804143936790036, 0.3195856063209964],
    [0.780312141589862, 0.2196878584101381],
    [0.7067953367108348, 0.29320466328916517],
    [0.769711007366323, 0.23028899263367697],
    [0.769711007366323, 0.23028899263367697],
    [0.7729079584609388, 0.22709204153906115],
    [0.780312141589862, 0.2196878584101381],
    [0.7355988315726243, 0.2644011684273757],
    [0.780312141589862, 0.2196878584101381],
    [0.7510962272030672, 0.24890377279693277],
    [0.7802282829948453, 0.21977171700515474],
    [0.780312141589862, 0.2196878584101381],
    [0.6779519993905228, 0.32204800060947725],
    [0.7257604628145149, 0.27423953718548516],
    [0.7257604628145149, 0.27423953718548516],
    [0.7692638675777261, 0.2307361324222738],
    [0.780312141589862, 0.2196878584101381],
    [0.7729079584609388, 0.22709204153906115],
    [0.780312141589862, 0.2196878584101381],
    [0.7013425216602426, 0.2986574783397574],
    [0.780312141589862, 0.2196878584101381],
    [0.769711007366323, 0.23028899263367697],
    [0.780312141589862, 0.2196878584101381],
    [0.7549528655670701, 0.24504713443292986],
    [0.7575839691489974, 0.24241603085100258],
    [0.7575839691489974, 0.24241603085100258],
    [0.7067953367108348, 0.29320466328916517],
    [0.7013425216602426, 0.2986574783397574],
    [0.780312141589862, 0.2196878584101381],
    [0.7257604628145149, 0.27423953718548516],
    [0.7802282829948453, 0.21977171700515474],
    [0.7510962272030672, 0.24890377279693277],
    [0.767428653203549, 0.232571346796451],
    [0.780312141589862, 0.2196878584101381],
    [0.780312141589862, 0.2196878584101381],
    [0.7406302098400104, 0.25936979015998957],
    [0.780312141589862, 0.2196878584101381],
    [0.780312141589862, 0.2196878584101381],
    [0.754485107650303, 0.24551489234969706],
    [0.7575839691489974, 0.24241603085100258],
    [0.6779519993905228, 0.32204800060947725],
    [0.7355988315726243, 0.2644011684273757],
    [0.6804143936790036, 0.3195856063209964]
  ],
  target_column: "income",
  task_type: "classification",
  true_y: [
    1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1,
    0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1
  ]
};
