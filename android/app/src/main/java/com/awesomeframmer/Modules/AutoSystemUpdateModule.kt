package com.awesomeframmer.Modules

import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.os.Build
import android.os.SystemClock
import android.provider.Settings
import android.util.DisplayMetrics
import android.view.WindowManager
import androidx.core.content.pm.PackageInfoCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import org.json.JSONObject
import javax.inject.Inject
import kotlin.math.pow
import kotlin.math.sqrt


class AutoSystemUpdateModule @Inject constructor(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "AutoSystemUpdate"
    }

    @SuppressLint("HardwareIds")
   val ANDROID_ID: String  = Settings.Secure.getString(reactApplicationContext.contentResolver, Settings.Secure.ANDROID_ID)

    private fun parseJsonVersion(jsonString: String): String {
        val jsonObject = JSONObject(jsonString)
        return jsonObject.getString("version")
    }

    private fun getApkVersion(): String {
        val packageManager = reactApplicationContext.packageManager
        val packageInfo: PackageInfo =
            packageManager.getPackageInfo(reactApplicationContext.packageName, 0)
        val versionName = packageInfo.versionName
        val versionCode = packageInfo.versionCode // or use versionCode if not using API 28+
        return "$versionName.$versionCode"
    }


    private fun compareVersionStrings(version1: String, version2: String): Boolean {
        val v1 = version1.split(".").map { it.toInt() }
        val v2 = version2.split(".").map { it.toInt() }

        for (i in 0 until v1.size.coerceAtMost(v2.size)) {
            if (v1[i] < v2[i]) return true
            if (v1[i] > v2[i]) return false
        }

        return if (v1.size < v2.size) true
        else if (v1.size > v2.size) false
        else false
    }

    @ReactMethod
    fun checkForUpdate(jsonString: String, promise: Promise) {
        val jsonVersion = parseJsonVersion(jsonString)
        val currentVersion = getApkVersion()
        promise.resolve(compareVersionStrings(currentVersion, jsonVersion))

    }

    private fun isTablet(): Boolean {
        // Find the current window manager, if none is found we can't measure the device physical size.
        val windowManager = reactApplicationContext.getSystemService(Context.WINDOW_SERVICE) as WindowManager


        // Get display metrics to see if we can differentiate handsets and tablets.
        // NOTE: for API level 16 the metrics will exclude window decor.
        val metrics = DisplayMetrics()
        windowManager.defaultDisplay.getRealMetrics(metrics)

        // Calculate physical size.
        val widthInches = metrics.widthPixels / metrics.xdpi.toDouble()
        val heightInches = metrics.heightPixels / metrics.ydpi.toDouble()
        val diagonalSizeInches = sqrt(widthInches.pow(2.0) + heightInches.pow(2.0))

        return diagonalSizeInches > 6.9 && diagonalSizeInches <= 18.0
    }




    override fun getConstants(): Map<String, Any?> {
        val constants: MutableMap<String, Any?> = HashMap()
        val pManager: PackageManager = reactApplicationContext.packageManager
        val pInfo: PackageInfo
        try {
            pInfo = pManager.getPackageInfo(
                reactApplicationContext.packageName,
                PackageManager.GET_SIGNATURES
            )
            constants["versionName"] = pInfo.versionName
            constants["versionCode"] = PackageInfoCompat.getLongVersionCode(pInfo)
            constants["packageName"] = pInfo.packageName
            constants["firstInstallTime"] = pInfo.firstInstallTime
            constants["lastUpdateTime"] = pInfo.lastUpdateTime
            constants["systemUpTime"] = SystemClock.elapsedRealtime()
            constants["ANDROID_ID"] = ANDROID_ID
            constants["systemVersion"] = "Android ${Build.VERSION.RELEASE}"
            constants["isTablet"] = isTablet()

        } catch (e: PackageManager.NameNotFoundException) {
            e.printStackTrace()
        }

        return constants
    }


    @ReactMethod
    public fun install(url: String) {
        UpdateDownloader(reactApplicationContext).execute(url)
    }
}








