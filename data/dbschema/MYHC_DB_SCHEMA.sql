USE [master]
GO
/****** Object:  Database [MyHCManager]    Script Date: 7/18/2024 3:44:06 PM ******/
CREATE DATABASE [MyHCManager]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'MyHCManager', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\MyHCManager.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'MyHCManager_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\MyHCManager_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [MyHCManager] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [MyHCManager].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [MyHCManager] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [MyHCManager] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [MyHCManager] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [MyHCManager] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [MyHCManager] SET ARITHABORT OFF 
GO
ALTER DATABASE [MyHCManager] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [MyHCManager] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [MyHCManager] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [MyHCManager] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [MyHCManager] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [MyHCManager] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [MyHCManager] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [MyHCManager] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [MyHCManager] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [MyHCManager] SET  DISABLE_BROKER 
GO
ALTER DATABASE [MyHCManager] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [MyHCManager] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [MyHCManager] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [MyHCManager] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [MyHCManager] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [MyHCManager] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [MyHCManager] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [MyHCManager] SET RECOVERY FULL 
GO
ALTER DATABASE [MyHCManager] SET  MULTI_USER 
GO
ALTER DATABASE [MyHCManager] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [MyHCManager] SET DB_CHAINING OFF 
GO
ALTER DATABASE [MyHCManager] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [MyHCManager] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [MyHCManager] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [MyHCManager] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'MyHCManager', N'ON'
GO
ALTER DATABASE [MyHCManager] SET QUERY_STORE = ON
GO
ALTER DATABASE [MyHCManager] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [MyHCManager]
GO
/****** Object:  User [LAPTOP-8SHVUJ6V\clayh]    Script Date: 7/18/2024 3:44:06 PM ******/
CREATE USER [LAPTOP-8SHVUJ6V\clayh] FOR LOGIN [LAPTOP-8SHVUJ6V\clayh] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  User [AdminUser]    Script Date: 7/18/2024 3:44:06 PM ******/
CREATE USER [AdminUser] FOR LOGIN [siteUser] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  Table [dbo].[AdminLogin]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AdminLogin](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Email] [varchar](255) NOT NULL,
	[Password] [nvarchar](100) NOT NULL,
	[DateCreated] [datetime] NULL,
	[DateUpdated] [datetime] NULL,
 CONSTRAINT [PK_AdminLogin] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Availability]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Availability](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Date] [date] NOT NULL,
	[Time] [time](0) NOT NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedDate] [datetime] NULL,
 CONSTRAINT [PK_Availability] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ClientDetail]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ClientDetail](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
	[First] [varchar](100) NULL,
	[Last] [varchar](100) NULL,
	[PlanStart] [datetime] NULL,
	[PlanEnd] [datetime] NULL,
	[HasOrder] [bit] NULL,
	[DateCreated] [datetime] NULL,
	[DateUpdated] [datetime] NULL,
 CONSTRAINT [PK_ClientDetail] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ClientMeetDetail]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ClientMeetDetail](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ClientId] [int] NOT NULL,
	[MeetDate] [date] NOT NULL,
	[MeetTime] [time](7) NOT NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedDate] [datetime] NULL,
	[MeetDescription] [varchar](255) NULL,
 CONSTRAINT [PK_ClientMeetDetail] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ClientMeetDetail]  WITH CHECK ADD  CONSTRAINT [FK_ClientMeetDetail_ClientDetail] FOREIGN KEY([ClientId])
REFERENCES [dbo].[ClientDetail] ([Id])
GO
ALTER TABLE [dbo].[ClientMeetDetail] CHECK CONSTRAINT [FK_ClientMeetDetail_ClientDetail]
GO
/****** Object:  StoredProcedure [dbo].[uspDeleteAvailability]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS OFF
GO
SET QUOTED_IDENTIFIER ON
GO
--Availability GET sp
CREATE PROCEDURE [dbo].[uspDeleteAvailability]
	@Id		INT
AS
BEGIN TRY
	DECLARE @RowsDeleted INT;

	DELETE FROM [MyHCManager].[dbo].[Availability]
	WHERE Id = @Id

	SET @RowsDeleted = @@ROWCOUNT;
    
	RETURN @RowsDeleted 

END TRY
BEGIN CATCH
    PRINT 'Error: ' + ERROR_MESSAGE();
END CATCH;


SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[uspGetAdminLogin]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Client Login GET sp
CREATE PROCEDURE [dbo].[uspGetAdminLogin]
	@email varchar(255)

AS
BEGIN
SELECT(
    SELECT Id, Email,Password
    FROM [MyHCManager].[dbo].[AdminLogin](nolock)
	WHERE Email = @email
    FOR JSON PATH) AS 'AdminLogin'
END

SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[uspGetAllClients]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Client Login GET sp
CREATE PROCEDURE [dbo].[uspGetAllClients]
AS
BEGIN
SELECT(
    SELECT Id,Email,First,Last,PlanStart,PlanEnd,HasOrder
    FROM [MyHCManager].[dbo].[ClientDetail](nolock)
    FOR JSON PATH) AS 'AllClients'
END

SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[uspGetAvailability]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Availability GET sp
CREATE PROCEDURE [dbo].[uspGetAvailability]

AS
BEGIN
SELECT(
    SELECT Id,Date,Time
    FROM [MyHCManager].[dbo].[Availability](nolock)
    FOR JSON PATH) AS 'Availability'
END

SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[uspGetAvailabilityByDate]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Availability GET sp
CREATE PROCEDURE [dbo].[uspGetAvailabilityByDate]
	@date datetime

AS
BEGIN
SELECT(
    SELECT Id,Date,Time
    FROM [MyHCManager].[dbo].[Availability](nolock)
	WHERE Date = @date
	ORDER BY Date
    FOR JSON PATH) AS 'DatesAvailDate'
END

SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[uspGetAvailabilityByMonth]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Availability GET sp
CREATE PROCEDURE [dbo].[uspGetAvailabilityByMonth]
	@month int

AS
BEGIN
SELECT(
    SELECT Id,Date,Time
    FROM [MyHCManager].[dbo].[Availability](nolock)
	WHERE MONTH(Date) = @month
	ORDER BY Date
    FOR JSON PATH) AS 'DatesAvailMonth'
END

SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[uspGetClientAppts]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Availability GET sp
CREATE PROCEDURE [dbo].[uspGetClientAppts]
	@email NVARCHAR(255)

AS
BEGIN
SELECT(
    SELECT DISTINCT MeetDate, MeetTime, MeetDescription
    FROM [MyHCManager].[dbo].ClientMeetDetail a(NOLOCK)
	INNER JOIN [MyHCManager].[dbo].ClientDetail b(NOLOCK) on a.ClientId = b.Id
	WHERE b.Email = @email
	ORDER BY MeetDate,MeetTime ASC
    FOR JSON PATH) AS 'MyApptList'
END

SET ANSI_NULLS OFF

GO
/****** Object:  StoredProcedure [dbo].[uspGetClientsDetail]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Client Login GET sp
CREATE PROCEDURE [dbo].[uspGetClientsDetail]
	@id NVARCHAR(255)
AS
BEGIN
SELECT(
    SELECT Id,Email,First,Last,PlanStart,PlanEnd,HasOrder
    FROM [MyHCManager].[dbo].[ClientDetail](nolock)
	WHERE Id = @id
    FOR JSON PATH) AS 'ClientDetail'
END

SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[uspGetClientsDetailById]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Client Login GET sp
CREATE PROCEDURE [dbo].[uspGetClientsDetailById]
	@id INT
AS
BEGIN
SELECT(
    SELECT Id,Email,First,Last,PlanStart,PlanEnd,HasOrder
    FROM [MyHCManager].[dbo].[ClientDetail](nolock)
	WHERE iD = @id
    FOR JSON PATH) AS 'ClientDetail'
END

SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[uspGetClientsProfile]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Client Login GET sp
CREATE PROCEDURE [dbo].[uspGetClientsProfile]
AS
BEGIN
SELECT(
    SELECT Id,Email,First,Last
    FROM [MyHCManager].[dbo].[ClientDetail](nolock)
    FOR JSON PATH) AS 'ClientDetail'
END

SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[uspGetClientsWithNoOrders]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Client Login GET sp
CREATE PROCEDURE [dbo].[uspGetClientsWithNoOrders]
AS
BEGIN
SELECT(
    SELECT Id,Email,First,Last
    FROM [MyHCManager].[dbo].[ClientDetail](nolock)
	WHERE HasOrder = 0
    FOR JSON PATH) AS 'ClientsWithNoOrders'
END

SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[uspGetClientsWithOrders]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Client Login GET sp
CREATE PROCEDURE [dbo].[uspGetClientsWithOrders]
AS
BEGIN
SELECT(
    SELECT Id,Email,First,Last
    FROM [MyHCManager].[dbo].[ClientDetail](nolock)
	WHERE HasOrder = 1
    FOR JSON PATH) AS 'ClientsWithOrders'
END

SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[uspGetEventsByMonth]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Availability GET sp
CREATE PROCEDURE [dbo].[uspGetEventsByMonth]
	@month int

AS
BEGIN
SELECT(
    SELECT DISTINCT a.Id,MeetDate,MeetTime,MeetDescription,b.First ,b.Last
    FROM [MyHCManager].[dbo].ClientMeetDetail a(nolock)
	INNER JOIN [MyHCManager].[dbo].ClientDetail b(nolock) on a.ClientId = b.Id
	WHERE MONTH(MeetDate) = @month
	ORDER BY MeetDate,MeetTime ASC
    FOR JSON PATH) AS 'DatesAvailMonth'
END

SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[uspInsertAvailability]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--INSERT CLIENT DETAIL  GET sp
CREATE  PROCEDURE [dbo].[uspInsertAvailability]
	@date	datetime,
	@time	time

AS
BEGIN
    INSERT INTO [MyHCManager].[dbo].[Availability] (Date,Time,CreatedDate)
	VALUES(@date, @time, GETDATE())
	SELECT SCOPE_IDENTITY() AS 'Id'

END

SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[uspInsertClientDetail]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--INSERT CLIENT DETAIL  GET sp
CREATE PROCEDURE [dbo].[uspInsertClientDetail]
	@email	NVARCHAR(255),
	@first	VARCHAR(100),
	@last	VARCHAR(100),
	@planstart	DATETIME,
	@planend	DATETIME,
	@hasOrder	BIT

AS
BEGIN
    INSERT INTO [MyHCManager].[dbo].[ClientDetail] (Email,First,Last,PlanStart,PlanEnd,HasOrder,DateCreated)
	VALUES(	@email,@first,@last,@planstart,@planend,@hasOrder,GETDATE())
	SELECT SCOPE_IDENTITY() AS 'Id'

END

SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[uspInsertClientMeetDate]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--INSERT CLIENT DETAIL  GET sp
CREATE PROCEDURE [dbo].[uspInsertClientMeetDate]
	@email	NVARCHAR(255),
	@meetdate	DATETIME,
	@meettime	TIME,
	@description	VARCHAR(255),
	@Id		INT

AS
BEGIN
	DECLARE @clientid	int
	SET @clientid = (SELECT TOP 1 Id from dbo.ClientDetail WHERE Email = @email)
	IF EXISTS (SELECT 1 
           FROM [MyHCManager].[dbo].[ClientMeetDetail]
           WHERE CAST(MeetDate AS DATE) = CAST(@meetdate AS DATE)
		   AND [MeetTime] = @meettime
		   AND ClientId = @clientId)
	BEGIN

		SELECT 0 AS 'Id'
	END 
	ELSE 
	BEGIN
		INSERT INTO [MyHCManager].[dbo].[ClientMeetDetail](ClientId,MeetDate,MeetTime,MeetDescription,CreatedDate)
		VALUES(@clientid,@meetdate,@meettime,@description,GETDATE())
		SELECT SCOPE_IDENTITY() AS 'Id'

		IF(@Id > 0)
			BEGIN
				DELETE FROM [MyHCManager].[dbo].Availability
				WHERE Id = @Id 
			END
	END 
END

SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[uspIsValidClientEmail]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Client Login GET sp
CREATE PROCEDURE [dbo].[uspIsValidClientEmail]
	@email NVARCHAR(255)
AS
BEGIN
	DECLARE @IsValid	INT
	IF EXISTS(SELECT TOP 1 Id FROM [MyHCManager].[dbo].[ClientDetail] WHERE Email = @email )
		BEGIN
			SET @IsValid =  1
		END
	ELSE 
		BEGIN
			SET @IsValid =  0
		END
SELECT @IsValid AS 'ISVALID'
END

SET ANSI_NULLS OFF
GO
/****** Object:  StoredProcedure [dbo].[uspRemoveMeeting]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Availability GET sp
CREATE PROCEDURE [dbo].[uspRemoveMeeting]
	@Id int

AS
BEGIN
	DECLARE @RowsDeleted INT;

	DELETE FROM [MyHCManager].[dbo].ClientMeetDetail
	WHERE Id = @Id

	SET @RowsDeleted = @@ROWCOUNT;
    
	RETURN @RowsDeleted 
END

SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[uspUpdateClientDetail]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--INSERT CLIENT DETAIL  GET sp
CREATE PROCEDURE [dbo].[uspUpdateClientDetail]
	@id		INT,
	@email	NVARCHAR(255),
	@planstart	DATETIME,
	@planend	DATETIME,
	@hasOrder	BIT

AS
BEGIN
	BEGIN TRY
		UPDATE [MyHCManager].[dbo].[ClientDetail] 
		SET Email = @email, PlanStart = @planstart, PlanEnd = @planend, HasOrder = @hasOrder,DateUpdated = GETDATE()
		where Id = @id
RETURN 1
		--SELECT SCOPE_IDENTITY() AS 'Id'
		--RETURN 1;
	END TRY
	BEGIN CATCH
	    DECLARE @ErrorMessage NVARCHAR(4000), @ErrorSeverity INT, @ErrorState INT;
        SELECT 
            @ErrorMessage = ERROR_MESSAGE(),
            @ErrorSeverity = ERROR_SEVERITY(),
            @ErrorState = ERROR_STATE();

        -- Throw the error
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
		RETURN 0;
	END CATCH
END

SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[uspUpdateClientHasOrder]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Client Login GET sp
CREATE PROCEDURE [dbo].[uspUpdateClientHasOrder]
	@hasOrder BIT,
	@email	nvarchar(255)
AS
BEGIN

	UPDATE [MyHCManager].dbo.[ClientDetail]
	SET HasOrder = @hasOrder
	WHERE Email = @email
	SELECT SCOPE_IDENTITY() AS 'Id'

END

SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[uspUpdateClientMeetDate]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--INSERT CLIENT DETAIL  GET sp
create PROCEDURE [dbo].[uspUpdateClientMeetDate]
	@email	NVARCHAR(255),
	@meetdate	DATETIME,
	@meettime	TIME


AS
BEGIN
	DECLARE @clientid	int
	SET @clientid = (SELECT TOP 1 Id from dbo.ClientDetail WHERE Email = @email)

    UPDATE [MyHCManager].[dbo].[ClientMeetDetail]
	SET MeetDate = @meetdate, MeetTime = @meettime
	WHERE ClientId = @clientid
	SELECT SCOPE_IDENTITY() AS 'Id'

END

SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[uspUpdatePlanDates]    Script Date: 7/18/2024 3:44:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Client Login GET sp
create PROCEDURE [dbo].[uspUpdatePlanDates]
	@email	NVARCHAR(255),
	@start	DATETIME,
	@end	DATETIME
AS
BEGIN
	UPDATE [MyHCManager].[dbo].[ClientDetail]
	SET PlanStart = ISNULL(@start,GETDATE()), PlanEnd = ISNULL(@end,NULL)
	WHERE Email = @email
	SELECT SCOPE_IDENTITY() AS 'Id'

END

SET ANSI_NULLS ON
GO
USE [master]
GO
ALTER DATABASE [MyHCManager] SET  READ_WRITE 
GO
