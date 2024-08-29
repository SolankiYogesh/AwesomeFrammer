package com.awesomeframmer.Modules

import android.Manifest
import android.app.Activity
import android.app.admin.DevicePolicyManager
import android.app.admin.SystemUpdatePolicy
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.IntentFilter

import android.os.BatteryManager
import android.os.Build
import android.os.UserManager
import android.provider.Settings
import android.view.View
import android.view.WindowInsets


import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.uimanager.IllegalViewOperationException

import com.awesomeframmer.MainActivity
import com.awesomeframmer.Modules.Utilities.log
import com.awesomeframmer.Modules.Utilities.toast
import com.awesomeframmer.SnapAdminReceiver
import javax.inject.Inject


class KIOSKModule @Inject constructor(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private lateinit var mAdminComponentName: ComponentName
    private lateinit var mDevicePolicyManager: DevicePolicyManager
    private val packageName = reactApplicationContext.packageName

    private val INSETS_TYPE_HIDE: Int = 5

    private val INSETS_TYPE_SHOW: Int = 6

    private val INSETS_TYPE_APPEARANCE: Int = 7

    private val INSETS_TYPE_APPEARANCE_CLEAR: Int = 8

    private val INSETS_TYPE_BEHAVIOR: Int = 9

    companion object {
        const val LOCK_ACTIVITY_KEY = "com.awesomeframmer.MainActivity"
    }


    @ReactMethod
    public fun init() {
        mAdminComponentName = SnapAdminReceiver.getComponentName(reactApplicationContext)
        mDevicePolicyManager =
            reactApplicationContext.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        log(
            (mDevicePolicyManager.isDeviceOwnerApp(reactApplicationContext.packageName)).toString()
        )
        if (mDevicePolicyManager.isDeviceOwnerApp(reactApplicationContext.packageName)) {
            toast(reactApplicationContext, "You Are Device Owner")
            setKioskPolicies(true, mDevicePolicyManager.isDeviceOwnerApp(packageName))

            mDevicePolicyManager.setStatusBarDisabled(mAdminComponentName, true)
            mDevicePolicyManager.clearUserRestriction(
                mAdminComponentName, UserManager.DISALLOW_INSTALL_APPS
            )
            mDevicePolicyManager.clearUserRestriction(
                mAdminComponentName, UserManager.DISALLOW_INSTALL_UNKNOWN_SOURCES
            )

            mDevicePolicyManager.setPermissionGrantState(
                mAdminComponentName,
                packageName,
                Manifest.permission.ACCESS_FINE_LOCATION,
                DevicePolicyManager.PERMISSION_GRANT_STATE_GRANTED
            )
            mDevicePolicyManager.setPermissionGrantState(
                mAdminComponentName,
                packageName,
                Manifest.permission.REQUEST_INSTALL_PACKAGES,
                DevicePolicyManager.PERMISSION_GRANT_STATE_GRANTED
            )
            mDevicePolicyManager.setPermissionGrantState(
                mAdminComponentName,
                packageName,
                Manifest.permission.INSTALL_PACKAGES,
                DevicePolicyManager.PERMISSION_GRANT_STATE_GRANTED
            )
            mDevicePolicyManager.setPermissionGrantState(
                mAdminComponentName,
                packageName,
                Manifest.permission.READ_EXTERNAL_STORAGE,
                DevicePolicyManager.PERMISSION_GRANT_STATE_GRANTED
            )
            val isStorage = +mDevicePolicyManager.getPermissionGrantState(
                mAdminComponentName, packageName, Manifest.permission.READ_EXTERNAL_STORAGE
            )
            val isLocation = mDevicePolicyManager.getPermissionGrantState(
                mAdminComponentName, packageName, Manifest.permission.ACCESS_FINE_LOCATION
            )
            val isInstallApps = mDevicePolicyManager.getPermissionGrantState(
                mAdminComponentName, packageName, Manifest.permission.INSTALL_PACKAGES
            )
            val isRequestInstallApps = mDevicePolicyManager.getPermissionGrantState(
                mAdminComponentName, packageName, Manifest.permission.REQUEST_INSTALL_PACKAGES
            )
            toast(reactApplicationContext, "Is Read Storage Granted => $${isStorage==1}")
            toast(reactApplicationContext, "Is Location Granted => ${isLocation==1}")
            toast(reactApplicationContext, "Is InstallApps Granted => ${isInstallApps==1}")
            toast(reactApplicationContext, "Is ReQuestInstallApps Granted => ${isRequestInstallApps==1}")
            log(
                 "Is ReQuestInstallApps Granted => $isRequestInstallApps"
            )
            log(
                 "Is InstallApps Granted => $isInstallApps"
            )
            log(
                 "Is Read Storage Granted => $isStorage"
            )
            log(
                 "Is Location Granted => $isLocation"
            )

        }
        Utilities.setMaxVolume(reactApplicationContext)

    }

    @ReactMethod
    public fun isAdmin(): Boolean {
        return mDevicePolicyManager.isDeviceOwnerApp(packageName)

    }

    @ReactMethod
    public fun remove() {
        if (isAdmin()) {

            setKioskPolicies(false, true)
            val intent = Intent(reactApplicationContext, MainActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            }
            intent.putExtra(LOCK_ACTIVITY_KEY, false)
            reactApplicationContext.currentActivity?.startActivity(intent)
            mDevicePolicyManager.clearDeviceOwnerApp(packageName)
            toast(
                reactApplicationContext,
                "You are no more admin have a good day!",
            )
        } else {
            toast(
                reactApplicationContext,
                "You are not admin \uD83D\uDE21",
            )
        }


    }


    private fun setKioskPolicies(enable: Boolean, isAdmin: Boolean) {
        if (isAdmin) {
            setRestrictions(enable)
            enableStayOnWhilePluggedIn(enable)
            setUpdatePolicy(enable)
            setAsHomeApp(enable)
            setKeyGuardEnabled(enable)
            navigationHide()
        }
        setLockTask(enable, isAdmin)
        setImmersiveMode(enable)
    }

    private fun setRestrictions(disallow: Boolean) {
        setUserRestriction(UserManager.DISALLOW_SAFE_BOOT, disallow)
        setUserRestriction(UserManager.DISALLOW_FACTORY_RESET, disallow)
        setUserRestriction(UserManager.DISALLOW_ADD_USER, disallow)
        setUserRestriction(UserManager.DISALLOW_MOUNT_PHYSICAL_MEDIA, disallow)
        setUserRestriction(UserManager.DISALLOW_ADJUST_VOLUME, disallow)
        mDevicePolicyManager.setStatusBarDisabled(mAdminComponentName, disallow)
    }

    private fun setUserRestriction(restriction: String, disallow: Boolean) = if (disallow) {
        mDevicePolicyManager.addUserRestriction(mAdminComponentName, restriction)
    } else {
        mDevicePolicyManager.clearUserRestriction(mAdminComponentName, restriction)
    }

    private fun enableStayOnWhilePluggedIn(active: Boolean) = if (active) {
        mDevicePolicyManager.setGlobalSetting(
            mAdminComponentName,
            Settings.Global.STAY_ON_WHILE_PLUGGED_IN,
            (BatteryManager.BATTERY_PLUGGED_AC or BatteryManager.BATTERY_PLUGGED_USB or BatteryManager.BATTERY_PLUGGED_WIRELESS).toString()
        )
    } else {
        mDevicePolicyManager.setGlobalSetting(
            mAdminComponentName, Settings.Global.STAY_ON_WHILE_PLUGGED_IN, "0"
        )
    }

    private fun setLockTask(start: Boolean, isAdmin: Boolean) {
        if (isAdmin) {
            mDevicePolicyManager.setLockTaskPackages(
                mAdminComponentName, if (start) arrayOf(packageName) else arrayOf()
            )
        }
        if (start) {
            reactApplicationContext.currentActivity?.startLockTask()
        } else {
            reactApplicationContext.currentActivity?.stopLockTask()
        }
    }


    private fun setUpdatePolicy(enable: Boolean) {
        if (enable) {
            mDevicePolicyManager.setSystemUpdatePolicy(
                mAdminComponentName, SystemUpdatePolicy.createWindowedInstallPolicy(60, 120)
            )
        } else {
            mDevicePolicyManager.setSystemUpdatePolicy(mAdminComponentName, null)
        }
    }


    private fun setImmersiveMode(enable: Boolean) {


        UiThreadUtil.runOnUiThread {
            val flags = if (enable) {
                (View.SYSTEM_UI_FLAG_LAYOUT_STABLE or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_FULLSCREEN or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY)

            } else {
                (View.SYSTEM_UI_FLAG_LAYOUT_STABLE or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN)

            }
            reactApplicationContext.currentActivity?.window?.decorView?.systemUiVisibility = flags
        }

    }

    private fun setAsHomeApp(enable: Boolean) {
        if (enable) {
            val intentFilter = IntentFilter(Intent.ACTION_MAIN).apply {
                addCategory(Intent.CATEGORY_HOME)
                addCategory(Intent.CATEGORY_DEFAULT)
            }
            mDevicePolicyManager.addPersistentPreferredActivity(
                mAdminComponentName,
                intentFilter,
                ComponentName(packageName, MainActivity::class.java.name)
            )
        } else {
            mDevicePolicyManager.clearPackagePersistentPreferredActivities(
                mAdminComponentName, packageName
            )
        }
    }

    private fun setKeyGuardEnabled(enable: Boolean) {
        mDevicePolicyManager.setKeyguardDisabled(mAdminComponentName, !enable)
    }

    private fun setSystemInsetsController(visibility: Int, insetsType: Int) {
        try {
            reactApplicationContext.currentActivity?.runOnUiThread {
                val requiredVersion = Build.VERSION_CODES.R
                if (Build.VERSION.SDK_INT < requiredVersion) {

                    return@runOnUiThread
                }
                val currentActivity: Activity? = reactApplicationContext.currentActivity
                val insetsController =
                    currentActivity?.window?.insetsController

                if (insetsController != null) {
                    if (insetsType == INSETS_TYPE_HIDE) {
                        insetsController.hide(visibility)
                    } else if (insetsType == INSETS_TYPE_SHOW) {
                        insetsController.show(visibility)
                    } else if (insetsType == INSETS_TYPE_APPEARANCE) {
                        insetsController.setSystemBarsAppearance(visibility, visibility)
                    } else if (insetsType == INSETS_TYPE_APPEARANCE_CLEAR) {
                        insetsController.setSystemBarsAppearance(0, visibility)
                    } else if (insetsType == INSETS_TYPE_BEHAVIOR) {
                        insetsController.systemBarsBehavior = visibility
                    }
                }

            }
        } catch (e: IllegalViewOperationException) {
            e.printStackTrace()

        }
    }

    private fun navigationHide() {
        setSystemUIFlags(
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION,

            )

    }

    private fun setSystemUIFlags(visibility: Int) {
        try {
            reactApplicationContext.currentActivity?.runOnUiThread {
                val currentActivity: Activity? = reactApplicationContext.currentActivity
                val decorView = currentActivity?.window?.decorView
                decorView?.systemUiVisibility = visibility
            }
        } catch (e: IllegalViewOperationException) {
            e.printStackTrace()
        }
    }

    override fun getName(): String {
        return "KIOSKModule"
    }

}