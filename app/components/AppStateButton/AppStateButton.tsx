import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Fab, Typography, CircularProgress } from '@material-ui/core';
import { logger } from '$Logger';
import { App } from '$Definitions/application.d';

import styles from './AppStateButton.css';

interface Props {
    unInstallApp: Function;
    openApp: Function;
    downloadAndInstallApp: Function;
    pauseDownload: Function;
    cancelDownload: Function;
    resumeDownload: Function;
    showErrorText?: boolean;
    application: App;
}

export class AppStateButton extends React.Component<Props> {
    handleDownload = () => {
        const { application, downloadAndInstallApp } = this.props;
        logger.warn( 'ApplicationOverview: clicked download ', application.name );
        downloadAndInstallApp( application );
    };

    handleOpen = () => {
        const { application, openApp } = this.props;
        logger.warn( 'ApplicationOverview: clicked open', application );
        openApp( application );
    };

    handleUninstall = () => {
        const { application, unInstallApp } = this.props;
        logger.warn( 'ApplicationOverview: clicked uninstall', application );
        unInstallApp( application );
    };

    handleCancelDownload = () => {
        const { application, cancelDownload } = this.props;
        logger.warn( 'ApplicationOverview: clicked cancel', application );
        cancelDownload( application );
    };

    handleResumeDownload = () => {
        const { application, resumeDownload } = this.props;
        logger.warn(
            'ApplicationOverview: clicked resume download',
            application
        );
        resumeDownload( application );
    };

    handlePauseDownload = () => {
        const { application, pauseDownload } = this.props;
        logger.silly(
            'ApplicationOverview: clicked pause download',
            application
        );
        pauseDownload( application );
    };

    render() {
        const { application, showErrorText = false } = this.props;

        const {
            isDownloadingAndInstalling,
            isInstalled,
            isOpen, // ?
            isDownloadingAndUpdating, // does this entail installing?
            isUninstalling,
            isPaused,
            hasUpdate,
            installFailed,
            progress,
            error
        } = application;

        let buttonText = isInstalled
            ? I18n.t( `buttons.open` )
            : I18n.t( `buttons.install` );
        let secondButtonText = I18n.t( `buttons.cancelInstall` );
        let showSecondButton =
            isDownloadingAndInstalling || isDownloadingAndUpdating;

        let handleClick = isInstalled ? this.handleOpen : this.handleDownload;
        let handleSecondButtonClick = () => {}; // otherwise nothing
        const errorMessage = showErrorText ? error : null;

        if ( error ) {
            buttonText = I18n.t( `buttons.retryInstall` );
        }

        if ( isDownloadingAndInstalling ) {
            buttonText = I18n.t( `buttons.pause` );
            secondButtonText = I18n.t( `buttons.cancelInstall` );

            handleClick = this.handlePauseDownload;
            handleSecondButtonClick = this.handleCancelDownload;
        }

        if ( isDownloadingAndUpdating ) {
            buttonText = I18n.t( `buttons.pause` );
            secondButtonText = I18n.t( `buttons.cancelUpdate` );
        }

        if ( isPaused ) {
            buttonText = I18n.t( `buttons.resume` );
            secondButtonText = I18n.t( `buttons.cancelInstall` );
            handleClick = this.handleResumeDownload;
            handleSecondButtonClick = this.handleCancelDownload;
        }

        if ( isUninstalling ) {
            buttonText = I18n.t( `buttons.uninstalling` );
            showSecondButton = false;
        }

        const percentageProgress = progress * 100;

        return (
            <React.Fragment>
                {errorMessage && (
                    <Typography color="error">{errorMessage}</Typography>
                )}
                <Fab
                    className={styles.actionButton}
                    variant="extended"
                    color="primary"
                    onClick={handleClick}
                    aria-label="Application Action Button"
                >
                    {buttonText}
                </Fab>
                {progress > 0 && (
                    <CircularProgress
                        value={percentageProgress}
                        variant="determinate"
                    />
                )}
                {showSecondButton && (
                    <Fab
                        className={styles.actionButton}
                        variant="extended"
                        color="primary"
                        onClick={handleSecondButtonClick}
                        aria-label="Application Secondary Action Button"
                    >
                        {secondButtonText}
                    </Fab>
                )}
            </React.Fragment>
        );
    }
}
