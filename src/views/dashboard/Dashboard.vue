<template>
    <div>
        <a-row :gutter="16">
            <a-col :span="12">
                <a-card class="card" style="height: 253px;">
                    <a-carousel autoplay effect="fade" :dots="false">
                        <div v-for="item1, index in data.weather" :key="index">
                            <SendOutlined :style="{ fontSize: '20px', color: '#08c', marginRight: '5px' }" />
                            <span style="font-size:22px">{{ item1.locationName }}</span>
                            <a-tooltip placement="right">
                                <template #title>
                                    <div>
                                        {{ item1.weatherElement[0].time[0].startTime }}
                                    </div>
                                    至
                                    <div>
                                        {{ item1.weatherElement[0].time[0].endTime }}
                                    </div>
                                </template>
                                <question-circle-two-tone style="margin-left: 5px" />
                            </a-tooltip>

                            <a-descriptions :column="2" style="margin-top:10px ;">
                                <a-descriptions-item label="天氣現象">
                                    {{
                                        item1.weatherElement.filter(x => x.elementName ===
                                            "Wx")[0].time[0].parameter.parameterName
                                    }}
                                </a-descriptions-item>
                                <a-descriptions-item label="降雨機率">
                                    <a-progress :percent="parseInt(item1.weatherElement.filter(x => x.elementName ===
                                    'PoP')[0].time[0].parameter.parameterName)" status="active" />
                                </a-descriptions-item>
                                <a-descriptions-item label="氣溫">
                                    {{
                                        item1.weatherElement.filter(x => x.elementName ===
                                            "MinT")[0].time[0].parameter.parameterName
                                    }}°C 至
                                    {{
                                        item1.weatherElement.filter(x => x.elementName ===
                                            "MaxT")[0].time[0].parameter.parameterName
                                    }}°C
                                </a-descriptions-item>
                                <a-descriptions-item label="舒適度">
                                    {{
                                        item1.weatherElement.filter(x => x.elementName ===
                                            "CI")[0].time[0].parameter.parameterName
                                    }}
                                </a-descriptions-item>
                            </a-descriptions>
                            <!-- <div v-for="item, index2 in item1.weatherElement" :key="index2">
                                {{
                                    item.elementName === "Wx" ? "天氣現象" : item.elementName === "PoP" ?
                                        "降雨機率" : item.elementName === "MinT" ? "最低溫" : item.elementName === "CI" ? "舒適度" : item.elementName === "MaxT" ? "最高溫" : "未知"
                                }} : {{ item.time[0].parameter.parameterName }}
                            </div> -->
                        </div>
                    </a-carousel>
                    <template #title>
                        <CloudOutlined :style="{ fontSize: '26px', color: '#08c', marginRight: '5px' }" />
                        <span style="font-size: 26px;">今日天氣</span>
                        <a-tooltip placement="right">
                            <template #title>
                                <span>中央氣象局公開資料</span>
                            </template>
                            <!-- <question-circle-two-tone style="margin-left: 5px" /> -->
                        </a-tooltip>
                    </template>
                    <template #extra>
                        <a href="https://opendata.cwb.gov.tw/dist/opendata-swagger.html">資料來源</a>
                    </template>
                </a-card>
            </a-col>
            <a-col :span="12">
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-card class="card">
                            <a-statistic :value="data.userCount" style="margin-right: 50px">
                                <template #title>
                                    <TeamOutlined :style="{ fontSize: '22px', color: '#08c', marginRight: '5px' }" />
                                    <span>使用者</span>
                                </template>
                            </a-statistic>
                        </a-card>
                    </a-col>
                    <a-col :span="12">
                        <a-card class="card">
                            <a-statistic :value="data.logCount" style="margin-right: 50px">
                                <template #title>
                                    <ExceptionOutlined
                                        :style="{ fontSize: '22px', color: '#08c', marginRight: '5px' }" />
                                    <span>LOG</span>
                                </template>
                            </a-statistic>
                        </a-card>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-card class="card">
                            <a-statistic :value="data.visitCount" style="margin-right: 50px">
                                <template #title>
                                    <TeamOutlined :style="{ fontSize: '22px', color: '#08c', marginRight: '5px' }" />
                                    <span>今日訪客數</span>
                                </template>
                            </a-statistic>
                        </a-card>
                    </a-col>
                    <a-col :span="12">
                        <a-card class="card">
                            <a-statistic value="99%" style="margin-right: 50px">
                                <template #title>
                                    <ExceptionOutlined
                                        :style="{ fontSize: '22px', color: '#08c', marginRight: '5px' }" />
                                    <span>好評率</span>
                                </template>
                            </a-statistic>
                        </a-card>
                    </a-col>

                </a-row>
            </a-col>

        </a-row>
        <a-row :gutter="16">
            <a-col :span="12">
                <a-card class="card" style="height: 500px;">
                    <!-- <a-statistic :value="data.products" style="margin-right: 50px"> -->
                    <a-list item-layout="horizontal" :data-source="data.commit" style="overflow:auto;height:400px">
                        <template #renderItem="{ item }">
                            <a-list-item>
                                <a-list-item-meta>
                                    <template #description>
                                        <div style="padding-left:15px ;">
                                            <SearchOutlined />
                                            <a :href="item.html_url" style="color: black;">{{
                                                item.commit.message
                                            }}</a>
                                        </div>
                                    </template>
                                    <template #title>
                                        <a-button type="link">{{
                                            item.commit.author.name
                                        }}</a-button>
                                        <span style="color:rgba(0, 0, 0, 0.45)">{{
                                            parseDate(item.commit.author.date)
                                        }}</span>
                                    </template>
                                    <template #avatar>
                                        <a-avatar :src="item.author.avatar_url" />
                                    </template>
                                </a-list-item-meta>
                            </a-list-item>
                        </template>
                    </a-list>
                    <template #title>
                        <GithubOutlined :style="{ fontSize: '26px', color: '#08c', marginRight: '5px' }" />
                        <span style="font-size:26px;">更新紀錄</span>
                        <a-tooltip placement="right">
                            <template #title>
                                <span>Github每次commit紀錄</span>
                            </template>
                            <question-circle-two-tone style="margin-left: 5px" />
                        </a-tooltip>
                    </template>
                    <!-- </a-statistic> -->
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import { QuestionCircleTwoTone } from '@ant-design/icons-vue'
import { reactive, onMounted, onUnmounted } from 'vue';
import { getDashboard } from "../../api/dashboard";
import { getWeather, Commits } from "../../api/thirdparty"
import { useRouter } from 'vue-router'
import moment from 'moment'

export default {
    components: {
        QuestionCircleTwoTone
    },
    setup() {
        const router = useRouter()

        const data = reactive({
            weather: [],
            commit: [],
            userCount: 0,
            logCount: 0,
            visitCount:0,
            timer: 0,
        })

        onMounted(() => {
            getDashboard().then(res => {
                console.log(res)
                data.userCount = res.data.data.userCount
                data.logCount = res.data.data.logCount
                data.visitCount = res.data.data.visitCount
            })
            getWeather().then(res => {
                // console.log(res)
                data.weather = res.data.records.location
            })
            Commits().then(res => {
                // console.log(res)
                data.commit = res.data
            })
        });

        onUnmounted(() => {
            clearInterval(data.timer)
            data.timer = 0
        })

        const parseDate = (date) => {
            return moment(date).format("yyyy-MM-DD")
        }

        return {
            data,
            parseDate
        }
    }
}
</script>

<style scoped>
.card {
    margin-bottom: 20px;
    box-shadow: 0 1px 16px 0 rgb(33 41 48 / 15%);
}
</style>