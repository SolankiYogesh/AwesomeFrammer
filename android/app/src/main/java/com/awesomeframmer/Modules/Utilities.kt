package com.awesomeframmer.Modules

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.media.AudioManager
import android.util.Log
import android.widget.Toast

import com.facebook.react.bridge.ReactApplicationContext


 object Utilities {

    /**
     * Check that valid permissions are set
     * @param context Context
     * @return Boolean value
     */
    fun validPermissions(context: ReactApplicationContext): Boolean {
        if (context.checkSelfPermission(Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            (context).currentActivity?.requestPermissions(
                arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE),
                0
            )
            return false
        }
        return true
    }

    fun toast (context:ReactApplicationContext,msg:String){
       context.currentActivity?.runOnUiThread{
            val isDev = com.awesomeframmer.BuildConfig.DEBUG
            if(isDev){
                Toast.makeText(context,msg,Toast.LENGTH_SHORT).show()
            }
        }
    }

     fun log (msg:String){
       Log.v("KIOSK",msg)
     }

     fun setMaxVolume(context: ReactApplicationContext){
         val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
         val maxVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC)
         audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, maxVolume, 0)
     }

}