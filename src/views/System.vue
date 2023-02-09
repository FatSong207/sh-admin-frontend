<template>
    <div>
        <a-row>
            <a-col :span="24">
                <a-card hoverable bordered class="card">
                    <a-descriptions title="Runtime" bordered :labelStyle="{ width: '160px' }" :column="3">
                        <a-descriptions-item label="os">{{ data.serverInfo.os.goos }}</a-descriptions-item>
                        <a-descriptions-item label="cpu nums">{{ data.serverInfo.os.numCpu }}</a-descriptions-item>
                        <a-descriptions-item label="compiler">{{ data.serverInfo.os.compiler }}</a-descriptions-item>
                        <a-descriptions-item label="go version">{{ data.serverInfo.os.goVersion }}</a-descriptions-item>
                        <a-descriptions-item label="goroutine nums">{{
                            data.serverInfo.os.numGoroutine
                        }}</a-descriptions-item>
                        <a-descriptions-item label="go root">{{ data.serverInfo.os.goRoot }}</a-descriptions-item>
                        <!-- <a-descriptions-item label="goroutine nums">
                            <a-progress type="circle" :percent="75" />
                        </a-descriptions-item> -->
                    </a-descriptions>
                </a-card>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="24">
                <a-card hoverable bordered class="card">
                    <a-descriptions title="CPU" bordered :labelStyle="{ width: '120px' }">
                        <a-descriptions-item label="core nums">{{ data.serverInfo.cpu.cores }}</a-descriptions-item>
                        <a-descriptions-item v-for="(item, index) in data.serverInfo.cpu.cpus" :key="index"
                            :label="'core' + (index + 1)">
                            <a-progress :percent="parseInt(item)" status="active" />
                        </a-descriptions-item>
                    </a-descriptions>
                </a-card>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="24">
                <a-card hoverable bordered class="card">
                    <a-switch v-model:checked="data.ramUnitSwitch" checked-children="GB" un-checked-children="MB" />
                    <br>
                    <br>
                    <a-descriptions title="RAM" bordered :column="3">
                        <a-descriptions-item label="total" :labelStyle="{ width: '120px' }"
                            :contentStyle="{ width: '160px' }">{{ total }}
                        </a-descriptions-item>
                        <a-descriptions-item label="used" :labelStyle="{ width: '120px' }"
                            :contentStyle="{ width: '160px' }">{{ used }}
                        </a-descriptions-item>
                        <a-descriptions-item label="usedPercent" :labelStyle="{ width: '120px' }"
                            :contentStyle="{ width: '160px' }">
                            <a-progress :percent="parseInt(data.serverInfo.ram.usedPercent)" status="active" />
                        </a-descriptions-item>
                        <!-- <a-descriptions-item v-for="(item, index) in data.serverInfo.cpu.cpus" :key="index"
                            :label="'core' + (index + 1)">
                            <a-progress :percent="parseInt(item)" size="small" />
                        </a-descriptions-item> -->
                    </a-descriptions>
                </a-card>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="24">
                <a-card hoverable bordered class="card">
                    <a-descriptions title="Disk" bordered :column="3">
                        <a-descriptions-item label="total" :labelStyle="{ width: '120px' }"
                            :contentStyle="{ width: '160px' }">{{ data.serverInfo.disk.total }}
                        </a-descriptions-item>
                        <a-descriptions-item label="used" :labelStyle="{ width: '120px' }"
                            :contentStyle="{ width: '160px' }">{{ data.serverInfo.disk.used }}
                        </a-descriptions-item>
                        <a-descriptions-item label="usedPercent" :labelStyle="{ width: '120px' }"
                            :contentStyle="{ width: '160px' }">
                            <a-progress :percent="parseInt(data.serverInfo.disk.usedPercent)" status="active" />
                        </a-descriptions-item>
                        <!-- <a-descriptions-item v-for="(item, index) in data.serverInfo.cpu.cpus" :key="index"
                            :label="'core' + (index + 1)">
                            <a-progress :percent="parseInt(item)" size="small" />
                        </a-descriptions-item> -->
                    </a-descriptions>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import { reactive, onMounted, onUnmounted, computed } from 'vue';
import { getServerInfo } from "../api/dashboard";

export default {
    setup() {

        const data = reactive({
            serverInfo: {
                os: {},
                cpu: {},
                ram: {},
                disk: {}
            },
            ramUnitSwitch: false,
            timer: 0,
        })

        onMounted(() => {
            reload()
            data.timer = setInterval(() => {
                reload()
            }, 1000 * 5);
        });

        onUnmounted(() => {
            clearInterval(data.timer)
            data.timer = 0
        })

        const reload = () => {
            getServerInfo().then(res => {
                // console.log(res.data.data)
                data.serverInfo.os = res.data.data.os
                data.serverInfo.cpu = res.data.data.cpu
                data.serverInfo.ram = res.data.data.ram
                data.serverInfo.disk = res.data.data.disk
            })
        }

        const B = 1
        const KB = B * 1024
        const MB = KB * 1024
        const GB = MB * 1024

        const used = computed(() => {
            if (data.ramUnitSwitch) {
                return (data.serverInfo.ram.used / GB).toFixed(2)
            } else {
                return (data.serverInfo.ram.used / MB).toFixed(2)
            }
        })

        const total = computed(() => {
            if (data.ramUnitSwitch) {
                return (data.serverInfo.ram.total / GB).toFixed(2)
            } else {
                return (data.serverInfo.ram.total / MB).toFixed(2)
            }
        })

        return {
            data,
            used,
            total,
        }
    }
}
</script>

<style scoped>
.card {
    margin-top: 20px;
    box-shadow: 0 1px 16px 0 rgb(33 41 48 / 15%);
}
</style>